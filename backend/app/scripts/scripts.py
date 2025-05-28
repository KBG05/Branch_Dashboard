import pandas as pd
from io import BytesIO
from datetime import datetime, timezone
from fastapi import HTTPException, status
import re
DEFAULT_DOA = datetime(1970, 1, 1, tzinfo=timezone.utc)

state_iso_codes = {
    "Andhra Pradesh": "IN-AP", "Arunachal Pradesh": "IN-AR", "Assam": "IN-AS", "Bihar": "IN-BR",
    "Chhattisgarh": "IN-CT", "Goa": "IN-GA", "Gujarat": "IN-GJ", "Haryana": "IN-HR",
    "Himachal Pradesh": "IN-HP", "Jharkhand": "IN-JH", "Karnataka": "IN-KA", "Kerala": "IN-KL",
    "Madhya Pradesh": "IN-MP", "Maharashtra": "IN-MH", "Manipur": "IN-MN", "Meghalaya": "IN-ML",
    "Mizoram": "IN-MZ", "Nagaland": "IN-NL", "Odisha": "IN-OR", "Punjab": "IN-PB", "Rajasthan": "IN-RJ",
    "Sikkim": "IN-SK", "Tamil Nadu": "IN-TN", "Telangana": "IN-TG", "Tripura": "IN-TR",
    "Uttar Pradesh": "IN-UP", "Uttarakhand": "IN-UT", "West Bengal": "IN-WB"
}

def extract_students_data(buffer: BytesIO):
    try:
        df = pd.read_excel(buffer, engine='openpyxl')
        columns_mapping = {
            "Name": "name",
            "Date of Birth": "dob",
            "USN": "usn",
            "Semester": "semester",
            "Gender": "gender",
            "DOA": "doa",
            "Seat Category Type": "seat_type",
            "CET / COMEK Rank": "ranking",
            "Allotted Category": "allotted_category",
            "Rural/Urban": "rural_urban",
            "Karnataka / Non Karnataka": "state",
            "Non Karnataka State": "non_ka_state"
        }

        # Rename only known columns, keep others as is
        df.rename(columns={k: v for k, v in columns_mapping.items() if k in df.columns}, inplace=True)

        # Transformations:

        def to_datetime(val):
            if pd.isna(val):
                return None
            if isinstance(val, (datetime, pd.Timestamp)):
                dt = val.to_pydatetime() if hasattr(val, "to_pydatetime") else val
                return dt.replace(tzinfo=timezone.utc)
            try:
                dt = pd.to_datetime(val, errors='coerce')
                if pd.isna(dt):
                    return None
                return dt.to_pydatetime().replace(tzinfo=timezone.utc)
            except Exception:
                return None

        if 'doa' in df.columns:
            df['doa'] = df['doa'].apply(to_datetime).fillna(DEFAULT_DOA)
        else:
            df['doa'] = DEFAULT_DOA

        if 'dob' in df.columns:
            df['dob'] = df['dob'].apply(to_datetime)
        else:
            df['dob'] = None

        def clean_ranking(val):
            if pd.isna(val):
                return None
            val_str = str(val).strip()
            return val_str if val_str else None

        if 'ranking' in df.columns:
            df['ranking'] = df['ranking'].apply(clean_ranking)
        else:
            df['ranking'] = None

        if 'gender' in df.columns:
            df['gender'] = df['gender'].apply(lambda x: str(x).strip().upper()[0] if x else None)
        else:
            df['gender'] = None

        # Fixed batch
        df['batch'] = 2023

        def get_state_code(row):
            state = str(row.get('state', '')).strip().title() if 'state' in row else ''
            non_ka_state = str(row.get('non_ka_state', '')).strip().title() if 'non_ka_state' in row else ''
            if state == "Karnataka":
                return "IN-KA"
            return state_iso_codes.get(non_ka_state, "UNKNOWN")

        df['state_code'] = df.apply(get_state_code, axis=1)

        if 'state' not in df.columns:
            df['state'] = 'UNKNOWN'
        else:
            df['state'] = df['state'].fillna('UNKNOWN')

        # Fixed branch
        df['branch'] = "Robotics & AI"

        # Drop rows missing critical info to avoid DB errors
        df = df.dropna(subset=['usn', 'name', 'seat_type', 'gender'])

        # Convert dataframe to dict records, including **all columns present**
        records = df.to_dict(orient='records')

        return records

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))



# Your existing PDF result extraction functions unchanged
def extract_results(buffer: BytesIO):
    columns = [
        "usn", "name", "22matm21", "22phym22", "22eme23", "22esc243", "22plc25d",
        "22pws26", "22ico27", "22idt28", "sgpa"
    ]

    student_data = []

    import pdfplumber
    with pdfplumber.open(buffer) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            lines = text.split("\n")
            for line in lines:
                line = re.sub(r"\s+", " ", line.strip())
                parts = line.split()
                if len(parts) >= 10 and re.search(r"1DS23RI\d{3}", line):
                    usn = parts[0]
                    name = " ".join(parts[1:-9])
                    grades = parts[-9:]
                    student_data.append([usn, name] + grades)

    df = pd.DataFrame(student_data, columns=columns)
    df["sgpa"] = pd.to_numeric(df["sgpa"], errors="coerce")
    return df


def wide_to_long_to_db(buffer:BytesIO):
    df = extract_results(buffer)
    subject_columns = df.columns[2:-1]  # Exclude usn, name, sgpa
    df_long = df.melt(
        id_vars=["usn", "name"],
        value_vars=subject_columns,
        var_name="subject",
        value_name="grade"
    )
    sgpa_df = df[["usn", "sgpa"]].drop_duplicates()
    df_long = df_long.merge(sgpa_df, on="usn", how="left")
    return df_long.to_dict(orient="records")





def extract_achievements_data(buffer:BytesIO):
    try:
        df = pd.read_excel(buffer, engine="openpyxl")

        columns_mapping = {
            "USN": "usn",
            "Title": "title",
            "Description": "description",
            "Achievement Type": "achievement_type",
            "Achievement Date": "achievement_date",
            "Certificate URL": "certificated_url"
        }

        # Rename columns
        df.rename(columns={k: v for k, v in columns_mapping.items() if k in df.columns}, inplace=True)

        # Drop rows missing required fields
        df = df.dropna(subset=["usn", "title"])

        # Convert NaNs to None
        df = df.where(pd.notnull(df), None)

        # Ensure all expected columns exist
        expected_columns = ["usn", "title", "description", "achievement_type", "achievement_date", "certificated_url"]
        for col in expected_columns:
            if col not in df.columns:
                df[col] = None
        df = df[expected_columns]

        return df.to_dict(orient="records")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

