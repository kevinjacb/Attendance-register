from typing import Any
from fastapi import FastAPI, File, UploadFile, Request, Form
from fastapi.middleware.cors import CORSMiddleware
import cv2 as cv
import time
import numpy as np
from PIL import Image
from process import Process

app = FastAPI()
handler = Process()

origins = [
    "http://localhost:3000",
]

app.add_middleware(CORSMiddleware, allow_origins=origins,
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/uploadimage")
async def getDetais(name: str = Form(...), email: str = Form(...), uimage: UploadFile = File(...)):
    # img = await file.read()
    # img = np.frombuffer(img, np.uint8)
    image = Image.open(uimage.file)
    image = np.array(image)
    image = cv.cvtColor(image, cv.COLOR_RGB2BGR)

    stat = handler.add_face(name, email, image)
    if(stat == 2):
        return {"error": "I think this person has already been registered"}
    elif(stat == 1):
        return {"error": "No face found in the image!"}
    # --------- debug code ---------
    # cv.imshow("image", image)
    # while(cv.waitKey(10) != ord('q')):
    #     time.sleep(0.1)
    # --------- debug code ---------

    return {"success": "encoded", "name": name, "email": email}


@app.post("/findmatch")
async def findMatch(image: UploadFile = File(...)):
    image = Image.open(image.file)
    image = np.array(image)
    image = cv.cvtColor(image, cv.COLOR_RGB2BGR)

    match = handler.find_match(image)
    if(len(match) == 0):
        return {"error": "No match found"}

    return {"success": "Match Found!", "name": match[0], "email": match[1]}


@app.get("/getall")
async def getAll():
    return {'data': handler.get_all()}


@app.post("/editvalue")
async def editValue(newName: str = Form(...), newEmail: str = Form(...), oldName: str = Form(...), oldEmail: str = Form(...)):
    return handler.edit_value(newName, newEmail, oldName, oldEmail)


@app.post("/deletevalue")
async def deleteValue(name: str = Form(...), email: str = Form(...)):
    return handler.delete_value(name, email)
