#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include "scan.h"

int ScanFile(smaTree tree, int n, FILE* input, FILE* output) {
    ScanCallback_data* data; int count;
    data=malloc(sizeof(ScanCallback_data));
    data->output=output;
    data->n=n;
    data->count=0;
    sma_search_file(tree, input, ScanCallback, data);
    count = data->count;
    free(data);
    return count;
}

int ScanFileMMAP(smaTree tree, int n, FILE* input, FILE* output) {
    ScanCallback_data* data; int count; int len; void* m;
    data=malloc(sizeof(ScanCallback_data));
    data->output=output;
    data->n=n;
    data->count=0;
    fseek(input,0,SEEK_END);
    len=ftell(input);
    fseek(input,0,SEEK_SET);
    m=mmap(NULL,len,PROT_READ,MAP_PRIVATE,input->_fileno,0);
    sma_search(tree, m, len, ScanCallback, data);
    munmap(m, len);
    count = data->count;
    free(data);
    return count;
}

void ScanCallback(int index, smaUserData value, void* data_) {
    ScanCallback_data* data = (ScanCallback_data*)data_;
    fprintf(data->output,"%d,%d,%x\n",data->n,index,value);
    ++data->count;
}
