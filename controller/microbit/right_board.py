#这里是右板的代码
#正常情况下右板负责采集<g_x> <g_y> <g_z> <speed_up>并发送给接收板进行数据处理
#当calibration按钮(button_a)被按下时发送<g_x> <g_y> <g_z>进行校准
from Micro:bit import *
import radio

radio.on()

while True:
    #当校准按钮被按下时发送校准字符串'cb <g_x> <g_y> <g_z>'
    if button_a.was_pressed():
        radio.send('cb '+str(accelerometer.get_x())+' '+\
                   str(accelerometer.get_y())+' '+\
                   str(accelerometer.get_z()))
        #校准时显示'C'，因为板子是竖直安装的，所以得另写
        display.show(Image('09990:90009:90009:90009:00000'))
        sleep(500)
        display.clear()
    else:
        #没有被按下时就发送正常的信息'rb <g_x> <g_y> <g_z> <speed_up>'
        #如果加速按钮被按下
        if button_b.is_pressed():
            radio.send('rb '+str(accelerometer.get_x())+' '+\
                       str(accelerometer.get_y())+' '+\
                       str(accelerometer.get_z())+' '+\
                       '1')
            #显示加速箭头
            display.show(Image('90000:99900:99999:99900:90000'))
            sleep(10)
            display.clear()
        #若没被按下
        else:
            radio.send('rb '+str(accelerometer.get_x())+' '+\
                       str(accelerometer.get_y())+' '+\
                       str(accelerometer.get_z())+' '+\
                       '0')
            #显示普通箭头
            display.show(Image('00900:00090:99999:00090:00900'))
            sleep(10)
            display.clear()
