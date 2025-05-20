import pandas as pd
import sqlite3

excel_file="/home/kbg/superset/dataset/2023-24 - Raw data with USN temp.xlsx"
df=pd.read_excel(excel_file)
columns_mapping = {
    "Name": "name",
    "Date of Birth": "dob",
    "USN": "usn",
    "Semester": "semester",
    "Gender": "gender",
    "DOA": "doa",
    "Seat Category Type": "seat_category",
    "CET / COMEK Rank":"ranking",
    "Allotted Category": "allotted_cat",
    "Rural/Urban": "rural_urban",
    "Karnataka / Non Karnataka": "state",
    "Non Karnataka State": "non_ka_state"

}
df=df[list(columns_mapping.keys())].rename(columns=columns_mapping)
df['dob'] = pd.to_datetime(df['dob'], errors='coerce')
df['doa'] = pd.to_datetime(df['doa'], errors='coerce')
df['ranking'] = pd.to_numeric(df['ranking'], errors='coerce')
# conn=sqlite3.connect("/home/kbg/superset/superset.db")
# cursor=conn.cursor()
# cursor.execute("""
#     CREATE TABLE IF NOT EXISTS students (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         name TEXT,
#         dob TEXT,
#         usn TEXT UNIQUE,
#         semester INTEGER,
#         gender TEXT,
#         doa TEXT,
#         seat_category TEXT,
#         allotted_cat TEXT,
#         rural_urban TEXT,
#         state TEXT,
#         non_ka_state TEXT
#         ranking INTEGER
#     )
# """)
# df.to_sql("students", conn, if_exists="replace", index=False)
# conn.commit()
# conn.close()
# print("Student data successfully stored in SQLite.")