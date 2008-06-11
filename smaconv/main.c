//smaconv读入模式列表文件，产生SMA二叉树，然后导出text和xml文件
#include <stdio.h>
#include <stdlib.h>
#include <memory.h>
#include "sma.h"

int main(int argc,char** argv)
{
    FILE* fd_pattern; FILE* fd_text; FILE* fd_xml;
    char* line; unsigned int value; char* pattern; char* HEXpattern; char* HEXchar;
    int ln; int len; int i; int ret; unsigned int ch;
    smaTree tree;
    //检查命令行参数
    if (argc != 4) {
        fprintf(stderr,"yoursunny.P2008.VirusScanner VirusLibrary SMA Convertor\n");
        fprintf(stderr,"Usage: smaconv pattern-list TEXT-out XML-out\n");
        fprintf(stderr,"pattern-list format: 1 entry per line, HEX-id=HEX-pattern\n");
        fprintf(stderr,"35D0=0012E0FFD1\n");
        fprintf(stderr,"# comments\n");
        return 1;
    }
    //打开输入输出文件
    fd_pattern=fopen(argv[1],"r");
    fd_text=fopen(argv[2],"w");
    fd_xml=fopen(argv[3],"w");
    //创建空树
    tree=smaNode_make();
    //准备缓冲区
    line=malloc(512);
    pattern=malloc(256);//模式
    HEXpattern=malloc(512);//十六进制字符串表示的模式
    HEXchar=malloc(3);//2位十六进制，表示一个字符
    HEXchar[2]='\0';
    ln=0;//行号
    //读取每一行，插入模式
    while (fgets(line,510,fd_pattern)>0) {
        ++ln;
        if (line[0]=='#') continue;
        memset(HEXpattern,'\0',512);
        ret=sscanf(line,"%x=%512s",&value,HEXpattern);
        if (ret!=2) {
            fprintf(stderr,"line %d: invalid line format\n",ln);
            continue;
        }
        for (len=0,i=0;(i<255) && (HEXpattern[i*2]!=0);++i) {
            HEXchar[0]=HEXpattern[i*2];
            HEXchar[1]=HEXpattern[i*2+1];
            ret=sscanf(HEXchar,"%x",&ch);
            if (ret!=1) break;//这使得i!=len
            pattern[i]=(char)ch;
            ++len;
        }
        if (i!=len) {//字符无效错误
            fprintf(stderr,"line %d: invalid HEX pattern\n",ln);
            continue;
        }
        if (len==0) {
            fprintf(stderr,"line %d: zero-length pattern\n",ln);
            continue;
        }
        sma_AddPattern(tree,pattern,len,value);
    }
    //遍历创建id
    sma_SetId(tree);
    //创建失败指针
    sma_BuildFail(tree);
    //导出文件
    sma_dumpText(tree,fd_text);
    sma_dumpXML(tree,fd_xml);
    //关闭文件
    fclose(fd_pattern);
    fclose(fd_text);
    fclose(fd_xml);
    return 0;
    /*
    fd=fopen("1.txt","w");
    sma_dumpText(tree,fd);
    fclose(fd);
    smaNode_destroy(tree);
    tree=NULL;
    fd=fopen("1.txt","r");
    tree=sma_loadText(fd);
    fclose(fd);
    sma_dumpXML(tree,stdout);
    //sma_search(tree,"smehishe",8,callback);
    sma_search(tree,"shershoursmehishe",17,callback);
    smaNode_destroy(tree);
    return 0;*/
}
