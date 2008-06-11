#include <stdio.h>
#include <stdlib.h>
#include <memory.h>
#include "sma.h"
#include "scan.h"

smaTree tree;
int FileNotFound;//文件找不到错误计数

void ScanOne(char* filename, int n) {
    FILE* fd_target;
    fd_target=fopen(filename,"r");
    if (fd_target == NULL) { ++FileNotFound; return; }
    ScanFileMMAP(tree,n,fd_target,stdout);
    fclose(fd_target);
}

int main(int argc, char** argv)
{
    int i,j; FILE* fd_pattern; FILE* fd_list; char* line;
    if (argc < 3) {
        fprintf(stderr,"yoursunny.P2008.VirusScanner FileScanner\n");
        fprintf(stderr,"Scan one or several files:\n");
        fprintf(stderr,"  scanner SMA-text target0 target1 ...\n");
        fprintf(stderr,"Scan a list of files, read list from file:\n");
        fprintf(stderr,"  scanner SMA-text @target-list ...\n");
        fprintf(stderr,"Scan a list of files, read list from stdin:\n");
        fprintf(stderr,"  scanner SMA-text @-\n");
        fprintf(stderr,"Output format:\n");
        fprintf(stderr,"  file-serial,pattern-position,pattern-value\n");
        return 1;
    }
    fd_pattern=fopen(argv[1],"r");
    tree=sma_loadText(fd_pattern);
    fclose(fd_pattern);
    if (argv[2][0] == '@') {
        fd_list=(argv[2][1] == '-') ? stdin : fopen(argv[2]+1,"r");
        line=calloc(1024,1);
        i=0;
        while (fgets(line,1023,fd_list)>0) {
            for (j=0;(line[j]!='\n') && (j<1023);++j); line[j]='\0';
            //printf(line);
            ScanOne(line,i);
            ++i;
            memset(line,0,1024);
        }
        free(line);
        if (argv[2][1] != '-') fclose(fd_list);
    } else {
        for (i=2; i<argc; ++i) {
            ScanOne(argv[i],i-2);
        }
    }
    smaNode_destroy(tree);
    return (FileNotFound>0) ? 2 : 0;
}
