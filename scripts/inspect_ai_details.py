with open('CPMS Agentic AI Stack Design.txt', 'r', encoding='utf-8') as f:
    text = f.read()

def show_section(title, start_str, end_str):
    p1 = text.find(start_str)
    if p1 != -1:
        p2 = text.find(end_str, p1) if end_str else p1 + 3000
        print(f"\n==================== {title} ====================")
        print(text[p1:p2 if p2 != -1 else p1 + 4000])

show_section("2. Architecture & 3. Agent Catalogue", "2. Agentic AI Architecture — Overview", "4. LLM Selection")
show_section("7. Human-in-the-Loop Control Design", "7. Human-in-the-Loop Control Design", "8. Technology Stack")
show_section("8. Tech Stack Recommendation", "8. Technology Stack Recommendation", "9. Compliance")
