from hf_detector import detect_toxic_content

text = "go kill urself"
result = detect_toxic_content(text)

print("Result:", result)
