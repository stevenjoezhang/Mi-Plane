#接收器的代码
#接收器收到左右板的信号后通过串口写入一个tuple：(<roll>, <pitch>, <speed_up>, <speed_down>, <refresh>)
#<roll>代表此时手柄的左右倾斜，以degree为单位
#<pitch>代表此时的手柄的前后俯仰，以degrees为单位
#<speed_up> 1代表加速，0代表不加速
#<speed_down> 1代表减速，0代表不减速
#<refresh> 1代表刷新场景，0代表不刷新
#其中采用平均值的方法进行滤波
from Micro:bit import *
import radio
from math import degrees,acos,atan,sqrt
radio.on()

#这是用于输出的变量
f_roll = 0
f_pitch = 0
speed_up = 0
speed_down = 0
refresh = 0

#这是辅助变量
#原始的roll，pitch
roll = 0
pitch = 0
#pitch的基准
standard_pitch = 55
#平均值滤波使用的list
roll_queue = []
pitch_queue = []

while True:
    #radio信号在这里获取，通过第一个分量辨别信号的来源
    incoming = radio.receive()
    incoming_list = str(incoming).split()
    #'cb'代表校准信号
    if incoming_list[0] == 'cb':
        #计算此时的g
        g = sqrt(int(incoming_list[1])**2+int(incoming_list[2])**2+int(incoming_list[3])**2)
        #计算standard_pitch，手柄过于水平的时候计算精度不够，此时视为无效信号，standard_pitch不会被刷新，同时显示Image.SAD
        #standard_pitch 的有效范围是45~65度 (g_z = -0.707~-0.423*g)
        if int(incoming_list[3]) < -0.707*g or int(incoming_list[3]) > -0.423*g:
            display.show(Image.SAD)
            sleep(500)
            display.clear()
        else:
            standard_pitch = degrees(acos(-int(incoming_list[3]) / g))
            display.show(Image.HAPPY)
            sleep(500)
            display.clear()

    #'rb'代表来自右板的信号，刷新和右板有关的变量<roll>, <pitch>, <speed_up>
    if incoming_list[0] == 'rb':
        #计算此时的g
        g = sqrt(int(incoming_list[1])**2+int(incoming_list[2])**2+int(incoming_list[3])**2)
        #计算roll，手柄过于水平的时候计算精度不够，此时视为无效信号，roll不会被刷新，同时显示'*'
        #roll的有效范围是g_x < -10和pitch  >20度 (g_z > -0.94*g)
        if int(incoming_list[1]) >= -10 or int(incoming_list[3]) < -0.94*g:
            display.show('*')
            sleep(10)
            display.clear()
        else:
            roll = degrees(atan(int(incoming_list[2])/(-int(incoming_list[1]))))
        #平均值滤波，维护一个10个数据长度的list，进来一个新数据则输出历史平均值，同时丢掉最老的数据
        roll_queue.append(roll)
        if len(roll_queue) == 10:
            f_roll = sum(roll_queue)/10
            roll_queue.pop(0)

        #计算pitch
        #计算pitch，手柄过于水平的时候计算精度不够，此时视为无效信号，roll不会被刷新，同时显示'*'
        #pitch的有效范围是pitch > 20度 (g_z > -0.94*g)
        if int(incoming_list[3]) < -0.94*g:
            display.show('*')
            sleep(10)
            display.clear()
        else:
            pitch = degrees(acos(-int(incoming_list[3]) / g))
        #平均值滤波，维护一个50个数据长度的list，进来一个新数据则输出历史平均值，同时丢掉最老的数据
        pitch_queue.append(pitch)
        if len(pitch_queue) == 50:
            f_pitch = sum(pitch_queue)/50
            pitch_queue.pop(0)
        speed_up = int(incoming_list[4])

        #串口写入(<roll>, <pitch>, <speed_up>, <speed_down>, <refresh>)
        uart.write(str((f_roll,f_pitch-standard_pitch,speed_up,speed_down,refresh)) + '\n')

    #'lb'代表来自左板的信号，刷新和左板有关的变量<speed_down>, <refresh>
    if incoming_list[0] == 'lb':
        speed_down = int(incoming_list[1])
        refresh = int(incoming_list[2])
        #串口写入(<roll>, <pitch>, <speed_up>, <speed_down>, <refresh>)
        uart.write(str((f_roll,f_pitch-standard_pitch,speed_up,speed_down,refresh)) + '\n')
        #按一下refresh只刷新一次，要归0
        refresh = 0
