//credo读入OpenAntiVirus的病毒库clamav.strings，输出smaconv可识别的模式列表文件、以及“id=病毒名”文件
#include <stdio.h>
#include <stdlib.h>
#include <memory.h>

int main()
{
    FILE* fd_credo; FILE* fd_pattern; FILE* fd_virname;
    char* line; char* virname; char* HEXpattern;
    unsigned int value;
    int ln,pos1,pos2;
    //打开文件
    fd_credo=fopen("clamav.strings","r");
    fd_pattern=fopen("pattern-list.txt","w");
    fd_virname=fopen("virus-name.txt","w");
    //准备缓冲区
    line=malloc(1024);
    virname=malloc(128);
    HEXpattern=malloc(800);
    ln=0;
    value=0;
    //读入文件
    while (fgets(line,1023,fd_credo)>0) {
        ++ln;
        memset(virname,0,128);
        memset(HEXpattern,0,800);
        //rv=sscanf(line,"%127s[%d]=%799s",virname,&hashkey,HEXpattern);
        for (pos1=0;(pos1<1024) && (line[pos1]!=0) && (line[pos1]!='[');++pos1);
        if ((pos1>=1024) || (line[pos1]!='[')) {
            fprintf(stderr,"line %d: invalid credo record, '[' not found\n",ln);
            continue;
        }
        memcpy(virname,line,pos1);
        for (;(pos1<1024) && (line[pos1]!=0) && (line[pos1]!='=');++pos1);
        for (pos2=++pos1;(pos2<1024) && (line[pos2]!='\n') && (line[pos2]!=0);++pos2);
        if ((pos2>=1024) || (line[pos1]==0)) {
            fprintf(stderr,"line %d: invalid credo record, '=' not found or zero-length HEX pattern\n",ln);
            continue;
        }
        memcpy(HEXpattern,line+pos1,pos2-pos1);
        ++value;
        fprintf(fd_pattern,"%x=%s\n",value,HEXpattern);
        fprintf(fd_virname,"%x=%s\n",value,virname);
    }
    //关闭文件
    fclose(fd_credo);
    fclose(fd_pattern);
    fclose(fd_virname);
    return 0;
}
