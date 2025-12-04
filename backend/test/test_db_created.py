



# test_tables.py
from db.database import engine
from sqlalchemy import inspect

# List of expected tables
expected_tables = [
    "users",
    "user_profiles",
    "user_activities",
    "auction_products",
    "bider_list"
]

# Create inspector
inspector = inspect(engine)

# Get all tables in the database
existing_tables = inspector.get_table_names()

# Check which tables exist
for table in expected_tables:
    if table in existing_tables:
        print(f"✅ Table '{table}' exists.")
    else:
        print(f"❌ Table '{table}' is missing!")

# Optional: assert all tables exist (raises error if any missing)
assert all(table in existing_tables for table in expected_tables), "Some tables are missing!"
