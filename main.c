#include "spce061a.h"
#include "Flash.h"
#include "DVR.h"
#include "s480.h"

#define START_ADDR	0xB800								// 定义录音起始地址
#define END_ADDR	0xFBFF								// 定义录音结束地址

void Delay(void)
{
	unsigned int uiCount;
	for(uiCount = 0;uiCount <= 1000;uiCount++)
	{
		*P_Watchdog_Clear = 0x0001;    //清看门狗
	}
}

void PlaySnd_Auto(unsigned int uiSndIndex,unsigned int uiDAC_Channel)
{
	SACM_S480_Initial(1);						//初始化为自动播放方式
	SACM_S480_Play(uiSndIndex,uiDAC_Channel,3);	//播放
	while((SACM_S480_Status() & 0x0001) != 0)
	{											//判断播放状态，如还在播放则继续循环
		SACM_S480_ServiceLoop();				//播放系统服务程序
		*P_Watchdog_Clear = 0x0001;			
	}	
	SACM_S480_Stop();							//停止播放
}

void PlayRecord()
{
	unsigned long Addr,EndAddr;
	unsigned int Ret;

	SACM_DVR_Initial(0);								// 初始化放音			
	SACM_DVR_InitQueue();								// 初始化解码队列
	SACM_DVR_InitDecoder(3);							// 初始化解码算法，声音由DAC1和DAC2输出

	Addr = START_ADDR + 1;
	EndAddr = Flash_ReadWord(START_ADDR);				// 从录音首地址中读出录音结束地址
	
	while(1)
	{
		*P_Watchdog_Clear = 0x01;						// 清看门狗
		while(SACM_DVR_TestQueue()!=1)					// 如果解码队列未满
		{
			Ret = Flash_ReadWord(Addr);					// 取录音数据
			SACM_DVR_FillQueue(Ret);					// 填充入解码队列
    		Addr++;
			if(Addr > EndAddr) break;
    	}
		if((SACM_DVR_Status()&0x01)==0 || (*P_IOA_Data&0x0002))	// 如果播放完毕或Key2键按下则停止
		{
        	SACM_DVR_Stop();							// 停止播放
        	break;
		}
        else
        	SACM_DVR_Decoder();							// 数据解码
	}
}

void Record(void)
{
	unsigned int Addr;
	unsigned int Ret;
	
	for(Addr=START_ADDR;Addr<=END_ADDR;Addr+=0x0100)
	{
		Flash_Erase(Addr);								// 擦除录音所需Flash空间
		*P_Watchdog_Clear = 0x01;
	}
	
	PlaySnd_Auto(3,3);//录音开始提示音
	
	SACM_DVR_Initial(0);								// 初始化录放音
	SACM_DVR_InitQueue();								// 初始化编码队列
	SACM_DVR_InitEncoder(0,0);							// 初始化编码算法
	
	Addr = START_ADDR + 1;								// 第一个单元用于保存录音结束地址
	while(1)											// 录音循环
	{
		*P_Watchdog_Clear = 0x01;						// 清看门狗
		SACM_DVR_Encoder();								// 对AD采集到的数据编码
		if(SACM_DVR_TestQueue()!=2)						// 如果编码队列不为空
		{	
			Ret = SACM_DVR_FetchQueue();				// 从编码队列中取数据
			Flash_WriteWord(Addr, Ret);					// 将数据写入flash 
			Addr += 1;
			if(Addr>END_ADDR || (*P_IOA_Data&0x0002))		// 如果到达尾地址或Key2键按下则结束录音
			{
				Flash_WriteWord(START_ADDR, Addr-1);	// 录音结束地址保存在[START_ADDR]中
				SACM_DVR_Stop();						// 停止录音
				break;
			}
		}
	}
}

//低8位奇偶校验，使低9位含偶数个1，高7位都是0
int Ebit(unsigned int n)
{
	unsigned int count=0;
	if (0x0001&n) ++count;
	if (0x0002&n) ++count;
	if (0x0004&n) ++count;
	if (0x0008&n) ++count;
	if (0x0010&n) ++count;
	if (0x0020&n) ++count;
	if (0x0040&n) ++count;
	if (0x0080&n) ++count;
	return ((count<<8)|n)&0x01ff;
}

//发送数据；返回：
//0=成功
//1=初始化超时
//2=过程中超时
//3=结束超时
//4=无录音数据
int Send()
{
	unsigned int Addr;
	unsigned int EndAddr;
	unsigned int Ret;
	unsigned int addrH;
	unsigned int addrL;
	unsigned int dataH;	unsigned int dataL;
	unsigned int i;
	unsigned int k;
	
	EndAddr = Flash_ReadWord(START_ADDR);				// 从录音首地址中读出录音结束地址
	if (EndAddr==0xffff) return 4;

	*P_IOB_Dir = 0xffff;				//初始化IOB口为同相输出口
	*P_IOB_Attrib = 0xffff;
	//准备发送，发送1100 1111 1001 0110，等待1111 1100回送
	*P_IOB_Data=0xcf96;
	i=0;
	while (1)
	{
		++i;
		Delay();
		if (i>3000)//无回应，请求失败
		{
			return 1;
		}
		if ((*P_IOA_Data&0xff00)==0xfc00) break;
	}

	for(Addr=START_ADDR;Addr<=EndAddr;++Addr)
	{
		*P_Watchdog_Clear = 0x01;

		Ret = Flash_ReadWord(Addr);					// 取录音数据

		//数据发送方式：5个周期
		//周期1：0000 000E 地址高8位
		//周期2：0001 000E 地址低8位
		//周期3：0010 000E 数据高8位
		//周期4：0011 000E 数据低8位
		//周期5：1101 111E 周期1、2、3、4的11位 周期1、2、3、4的15位
		//此时等待回应，IOA高8位：1001 0110，如1001 1111则需重发
		//第八位E是奇偶校验位，要求后9位含偶数个1
		Delay();
		addrH=0x00ff&(Addr>>8);
		*P_IOB_Data=addrH|0x0000|Ebit(addrH);
		Delay();
		addrL=0x00ff&Addr;
		*P_IOB_Data=addrL|0x1000|Ebit(addrL);
		Delay();
		dataH=0x00ff&(Ret>>8);
		*P_IOB_Data=dataH|0x2000|Ebit(dataH);
		Delay();
		dataL=0x00ff&Ret;
		*P_IOB_Data=dataL|0x3000|Ebit(dataL);
		Delay();
		k=((0x0022&addrH)<<3)|((0x0022&addrL)<<2)|((0x0022&dataH)<<1)|((0x0022&dataL)<<0);
		*P_IOB_Data=0xde00|Ebit(k);
		
		i=0;
		while (1)
		{
			++i;
			Delay();
			if (i>1000)//无回应，发送失败
			{
				return 2;
				break;
			}
			Ret=(*P_IOA_Data&0xff00);
			if (Ret==0x9600) break;
			if (Ret==0x9f00)
			{
				--Addr;//重发当前单元
				break;
			}
		}	
	}
	
	//全部发送完毕，发送1010 1111 1001 0110，等待1111 1010回送
	*P_IOB_Data=0xaf96;
	while (1)
	{
		++i;
		Delay();
		if (i>1000)//无回应，发送失败
		{
			return 3;
		}
		if ((*P_IOA_Data&0xff00)==0xfa00) break;
	}
	return 0;
}

//接收数据；返回：
//0=成功
//1=无数据
//2=发送方出错
//3=超时
int Accept()
{
	unsigned int Ret;
	unsigned int last=0;
	unsigned int addrH;
	unsigned int addrL;
	unsigned int dataH;
	unsigned int dataL;
	unsigned int Addr;
	unsigned int Data;
	//unsigned int i;
	unsigned int k;
	unsigned int rounds=0;
	
	if (*P_IOB_Data!=0xcf96) return 1;//未收到数据，返回

	PlaySnd_Auto(2,3);//铃声

	for(Addr=START_ADDR;Addr<=END_ADDR;Addr+=0x0100)
	{
		Flash_Erase(Addr);								// 擦除接收所需Flash空间
		*P_Watchdog_Clear = 0x01;
	}

	//准备接收，收到1100 1111 1001 0110，回送1111 1100
	*P_IOA_Dir = 0xffff;				//初始化IOA口为同相输出口
	*P_IOA_Attrib = 0xffff;

	*P_IOA_Data=0xfc00;//发出应答接收信号
	
	//i=0;
	while (1)
	{
		*P_Watchdog_Clear = 0x01;
		
		//++i;
		//if (i>60000)//超时，返回
		//	return 3;

		Ret=*P_IOB_Data;
		
		//if (Ret==0x0000||Ret==0xffff)//发送方已经出错，返回
		//	return 2;
		
		if (Ret==last) continue;//数据未变，不处理
		else last=Ret;
		
		//准备接收，收到1100 1111 1001 0110，回送1111 1100
		if (Ret==0xcf96)
		{
			*P_IOA_Data=0xfc00;
			continue;
		}

		//全部结束，收到1010 1111 1001 0110，回送1111 1010
		if (Ret==0xaf96)
		{
			*P_IOA_Data=0xfa00;
			++Addr;
			Flash_WriteWord(Addr,0xffff);
			break;
		}

		//一个字数据已接收，收到1101 111E 周期1、2、3、4的11位 周期1、2、3、4的15位，正确回送1001 0110，错误回送1001 1111
		if ((Ret&0xfe00)==0xde00)
		{
			k=((0x0022&addrH)<<3)|((0x0022&addrL)<<2)|((0x0022&dataH)<<1)|((0x0022&dataL)<<0);
			if (Ret==(0xde00|Ebit(k)) && (rounds&0x000f)==0x000f)//校验正确、且经过了4个周期
			{
				Addr=(addrH<<8)+addrL;
				Data=(dataH<<8)+dataL;
				if (Addr>=START_ADDR && Addr<=END_ADDR)//防止写入非数据区
					Flash_WriteWord(Addr,Data);
				*P_IOA_Data=0x9600;
			}
			else
			{
				*P_IOA_Data=0x9f00;				
			}
			rounds=0;
			//i=0;
		}
		switch (Ret&0x3000)
		{
			case 0x0000:
				//*P_IOA_Data=0x0000;
				k=Ret&0x00ff;
				if (Ebit(k)==(Ret&0x01ff)) {
					addrH=k;
					rounds=rounds|0x0001;
				}
				break;
			case 0x1000:
				//*P_IOA_Data=0x0000;
				k=Ret&0x00ff;
				if (Ebit(k)==(Ret&0x01ff)) {
					addrL=k;
					rounds=rounds|0x0002;
				}
				break;
			case 0x2000:
				//*P_IOA_Data=0x0000;
				k=Ret&0x00ff;
				if (Ebit(k)==(Ret&0x01ff)) {
					dataH=k;
					rounds=rounds|0x0004;
				}
				break;
			case 0x3000:
				//*P_IOA_Data=0x0000;
				k=Ret&0x00ff;
				if (Ebit(k)==(Ret&0x01ff)) {
					dataL=k;
					rounds=rounds|0x0008;
				}
				break;
		}
	}
	return 0;
}

int main()
{
	unsigned int Ret;
	unsigned int i;
	
	
	while(1)
	{
		*P_IOA_Dir = 0x0000;				//初始化IOA口为带下拉电阻输入口
		*P_IOA_Attrib = 0x0000;
		
		*P_IOB_Dir = 0x0000;				//初始化IOB口为带下拉电阻输入口
		*P_IOB_Attrib = 0x0000;
	
		Ret=Accept();
		switch (Ret)
		{
			case 0:
				PlaySnd_Auto(2,3);
				break;
			case 2:
			case 3:
				PlaySnd_Auto(1,3);
				break;
		}

		Ret=*P_IOA_Data;
		if (Ret&0x0001)									// Key1键按下则录音
		{
			Record();
			for (i=0;i<100;++i) Delay();
		}
		if (Ret&0x0002)									// Key2键按下则播放
		{
			while (1)//等待Key2释放，否则可能导致播放立即停止
			{
				*P_Watchdog_Clear = 0x01;
				if (!(*P_IOA_Data&0x0002))
				{
					break;
				}
			}
			PlayRecord();
			for (i=0;i<100;++i) Delay();
		}
		if (Ret&0x0004)									// Key3键按下则发送
		{
			Ret=Send();
			switch (Ret)
			{
				case 0:
					PlaySnd_Auto(0,3);
					break;
				case 1:
				case 2:
				case 3:
					PlaySnd_Auto(1,3);
					break;
			}
		}
		*P_Watchdog_Clear = 0x01;
	}
}
