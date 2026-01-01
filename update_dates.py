import csv
import datetime

# Define the CSV file path
csv_file_path = 'glossary_words_py.csv'

# Base date - January 5, 2026 is a Monday
base_date = datetime.date(2026, 1, 5)

# Read the CSV file
updated_rows = []
with open(csv_file_path, mode='r', newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    fieldnames = reader.fieldnames
    rows = list(reader)

# Update the specified columns
day_map = {'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3, 'friday': 4}
for i, row in enumerate(rows):
    week_index = i // 50  # Every 50 rows (5 days * 10 words), new week
    week_start = base_date + datetime.timedelta(days=7 * week_index)
    day_offset = day_map.get(row['day'].lower(), 0)
    date_sent = week_start + datetime.timedelta(days=day_offset)
    row['week_start'] = week_start.isoformat()
    row['date_sent'] = date_sent.isoformat()

# Write the updated data back to the CSV file
with open(csv_file_path, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Updated 'week_start' and 'date_sent' columns based on base date '{base_date}'")