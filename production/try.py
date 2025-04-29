def parse_vcf_natural_without_photo(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    contacts = content.strip().split("BEGIN:VCARD")
    for c in contacts:
        if "END:VCARD" not in c:
            continue

        lines = c.strip().splitlines()
        name = phone = email = None

        skip_photo = False
        for line in lines:
            if line.startswith("PHOTO"):
                skip_photo = True  # begin skipping photo lines
                continue
            if skip_photo:
                if not line.startswith(" "):  # photo lines are usually indented or multiline
                    skip_photo = False  # resume parsing if line is no longer part of photo
            if skip_photo:
                continue  # skip this line entirely

            if line.startswith("FN:"):
                name = line[3:]
            elif "TEL" in line:
                phone = line.split(":")[1]
            elif line.startswith("EMAIL:"):
                email = line[6:]

        # Build natural language sentence
        sentence = f"This is a contact for {name}."
        if phone:
            sentence += f" You can reach them at {phone}"
        if email:
            sentence += f" or via email at {email}"
        sentence += "."
        
        with open(r"C:\Users\DELL\Desktop\CloneFlow\production\user_settings\contact.txt", "a", encoding='utf-8') as output_file:
            output_file.write(sentence + "\n")

        print(sentence)
parse_vcf_natural_without_photo(r"C://Users//DELL//Desktop//CloneFlow//production//contacts.vcf")