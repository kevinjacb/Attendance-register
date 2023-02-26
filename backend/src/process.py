import face_recognition
import psycopg2
import numpy as np


class Process:

    def __init__(self, host="localhost", port="2005"):
        self.conn = psycopg2.connect(
            f"dbname=test user=root password=root host={host} port={port}")
        self._init_db()

    def _init_db(self):
        cur = self.conn.cursor()
        cur.execute(
            "CREATE TABLE IF NOT EXISTS faces (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), encoding BYTEA);")
        cur.close()
        self.conn.commit()

    def __del__(self):
        self.conn.close()

    # returns 0 if image is valid 1 if no face, 2 if more than 1 faces
    def valid_image(self, image):
        # Find all the faces in the image using the default HOG-based model.
        face_locations = face_recognition.face_locations(image)
        if len(face_locations) == 0:
            return 1
        elif len(face_locations) > 1:
            return 2

        return 0

    def add_face(self, name, email, image):  # return 0 on ok, 1 on no face, 2 on duplicate
        if self.valid_image(image=image) != 0:
            return 1

        face_encoding = face_recognition.face_encodings(image)[0]
        face_encoding_bytes = face_encoding.tobytes()

        dups = self.find_match(image)
        if len(dups) != 0:
            return 2

        cur = self.conn.cursor()
        cur.execute(
            "INSERT INTO faces (name, email, encoding) VALUES (%s, %s, %s);", (name, email, face_encoding_bytes))
        cur.close()
        self.conn.commit()
        return 0

    def find_match(self, image):
        if self.valid_image(image=image) != 0:
            return []

        face_encoding = face_recognition.face_encodings(image)[0]
        cur = self.conn.cursor()
        cur.execute("SELECT encoding FROM faces;")
        encodings = cur.fetchall()
        cur.close()
        self.conn.commit()

        if(len(encodings) == 0):
            return []

        # print("first one boi", encodings[0][0].tobytes())
        cencodings = encodings
        encodings = []
        for encoding in cencodings:
            encodings.append(np.frombuffer(encoding[0], dtype=np.float64))

        matches = face_recognition.compare_faces(
            encodings, face_encoding)
        distances = face_recognition.face_distance(
            encodings, face_encoding)

        best_match = np.argmin(distances)
        if matches[best_match]:
            cur = self.conn.cursor()
            cur.execute(
                'SELECT name, email FROM faces WHERE encoding = %(encoding)s;', {'encoding': cencodings[best_match][0]})
            result = cur.fetchone()
            cur.close()
            self.conn.commit()

            return result

        return []

    def get_all(self):
        cur = self.conn.cursor()
        cur.execute("SELECT name, email FROM faces;")
        result = cur.fetchall()
        cur.close()
        self.conn.commit()
        return result

    def edit_value(self, new_name, new_email, old_name, old_email):
        try:
            cur = self.conn.cursor()
            cur.execute("UPDATE faces SET name = %s, email = %s WHERE name = %s AND email = %s;",
                        (new_name, new_email, old_name, old_email))
            cur.close()
            self.conn.commit()
        except:
            return {"status": "error"}
        return {"status": "ok"}

    def delete_value(self, name, email):
        try:
            cur = self.conn.cursor()
            cur.execute("DELETE FROM faces WHERE name = %s AND email = %s;",
                        (name, email))
            cur.close()
            self.conn.commit()
        except:
            return {"status": "error"}
        return {"status": "ok"}
