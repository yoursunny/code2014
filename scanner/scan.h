#ifndef SCAN_H
#define SCAN_H

#include "sma.h"

//扫描一个文件
//如果发现特征，在output中写入记录：n,特征位置,特征编号HEX，每行一条
//如果未发现特征，不输出任何信息
//返回发现的特征数量
int ScanFile(smaTree tree, int n, FILE* input, FILE* output);

//用mmap方式扫描一个文件
int ScanFileMMAP(smaTree tree, int n, FILE* input, FILE* output);

//发现特征的回调
void ScanCallback(int index, smaUserData value, void* data);

typedef struct ScanCallback_data {
    FILE* output;
    int n;
    int count;
} ScanCallback_data;

#endif // SCAN_H
