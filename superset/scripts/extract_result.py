import pdfplumber
import pandas as pd
import re

def extract_results(pdf_path: str):
    # Define columns
    columns = ["USN", "NAME", "22MATM21", "22PHYM22", "22EME23", "22ESC243", "22PLC25D", 
               "22PWS26", "22ICO27", "22IDT28", "SGPA"]
    
    # Extract student data
    student_data = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                lines = text.split("\n")
                for line in lines:
                    line = re.sub(r"\s+", " ", line.strip())  # Normalize spaces
                    parts = line.split()
                    if len(parts) >= 10 and re.search(r"1DS23RI\d{3}", line):  # Corrected regex
                        usn = parts[0]
                        name = " ".join(parts[1:-9])  # Merge name parts
                        grades = parts[-9:]  # Last 9 elements are grades + SGPA
                        student_data.append([usn, name] + grades)
    
    # Convert to DataFrame
    df = pd.DataFrame(student_data, columns=columns)
    return df
