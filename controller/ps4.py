#https://stackoverflow.com/questions/46557583/how-to-identify-which-button-is-being-pressed-on-ps4-controller-using-pygame

import pygame
import websocket
import json

#websocket.enableTrace(True)
ws = websocket.WebSocket()
ws.connect("ws://localhost:9500/")
#ws.run_forever()

pygame.init()

j = pygame.joystick.Joystick(0)
j.init()

lastvalue = [0, 0, 0, 0, 0, 0];
button = ["SQUARE", "X", "CIRCLE", "TRIANGLE", "L1", "R1", "L2", "R2", "SHARE", "OPTIONS", "LEFT ANALOG PRESS", "RIGHT ANALOG PRESS", "PS4 ON BUTTON", "TOUCHPAD PRESS"]

while True:
    events = pygame.event.get()
    for event in events:
        if event.type == pygame.JOYAXISMOTION and event.axis in [1, 2]:# and abs(lastvalue[event.axis] - event.value) > 0.01
            lastvalue[event.axis] = event.value
            dic = {
                "type": "analog_input",
                "input": [lastvalue[2], lastvalue[1], 0, 0, 0]
            }
            #print(dic)
            #ws = websocket.WebSocketApp("ws://localhost:9500/")
            ws.send(json.dumps(dic))
            #ws.close()
        break
        if event.type == pygame.JOYAXISMOTION:
            if abs(lastvalue[event.axis] - event.value) > 0.1:
                print("Axis", event.axis, event.value)
                lastvalue[event.axis] = event.value
        elif event.type == pygame.JOYBUTTONDOWN:
            print("Button Pressed", button[event.button])
        elif event.type == pygame.JOYBUTTONUP:
            print("Button Released", button[event.button])
        elif event.type == pygame.JOYHATMOTION:
            print("Hat", event.hat, event.value)
