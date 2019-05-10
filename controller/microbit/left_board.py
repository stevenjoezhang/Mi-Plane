#这里是左板的代码
#左板负责采集<speed_down> <refresh>并发送给接收板进行数据处理
from Micro:bit import *
import radio

radio.on()

refresh = 0

while True:
    #发送信息'rb <speed_down> <refresh>'
    #如果refresh按钮被按下
    if button_b.was_pressed():
        refresh = 1
        display.show(Image('99999:99999:99999:99999:99999'))
        sleep(500)
        display.clear()
    else:
        #如果减速按钮被按下
        if button_a.is_pressed():
            radio.send('lb 1 '+str(refresh))
            display.show(Image('90000:99900:99999:99900:90000'))
            sleep(10)
            display.clear()
            #refresh归0
            refresh = 0
        #如果减速按钮没被按下
        else:
            radio.send('lb 0 '+str(refresh))
            display.show(Image('00900:09000:99999:09000:00900'))
            sleep(10)
            display.clear()
            #refresh归0
            refresh = 0
