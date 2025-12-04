


def normalize_email(email: str) -> str:
    return email.lower()
def remove_whitespace(s: str) -> str:
    return s.strip()


emial = "Samule@a2sv.org"
print(normalize_email(emial))