#include <stdlib.h>
#include <memory.h>
#include "sma.h"

smaNode* smaNode_make() {
    smaNode* n;
    //必须用calloc初始化为0，malloc将不作初始化
    n=calloc(sizeof(smaNode),1);
    return n;
}

void smaNode_destroy(smaNode* n) {
    if (n==NULL) return;
    smaNode_destroy(n->Lchild);
    smaNode_destroy(n->Rchild);
    free(n);
}

smaState sma_goto(smaState p, unsigned int ch) {
    if (p==NULL) return NULL;
    if ((ch < p->Lchar) || (p->Lchild == NULL)) return NULL;
    else if (ch == p->Lchar) return p->Lchild;
    else {
        p=p->Lchild;
        while ((p != NULL) && (ch > p->Rchar)) p = p->Rchild;
        if ((p != NULL) && (ch == p->Rchar)) return p->Rchild;
        else return NULL;
    }
}

void sma_AddPattern(smaTree tree, const char* pattern, int len, smaUserData value) {
    smaState p,r; int i;
    p=tree; i=0;
    //printf("=> %s",pattern);
    //寻找公共前缀
    while ((i<len) && ((r=sma_goto(p,sma_ch2uint(pattern[i]))) != NULL)) { p=r; ++i; }
    //现在p节点代表的串是pattern的前缀，长度为i
    //printf(" %x %d %d\n",p,len,i);
    sma_InsertPattern(p, pattern, len, i, value);
}

void sma_InsertPattern(smaState p, const char* pattern, int len, int i, smaUserData value) {
    unsigned int ch;
    if (i>=len) return;
    ch=sma_ch2uint(pattern[i]);
    smaState n=smaNode_make();
    n->Parent=p;
    if (p->Lchild == NULL) {
        //printf("A");
        p->Lchar=ch;
        p->Lchild=n;
    } else if (ch < p->Lchar) {
        //printf("B");
        n->Rchar=p->Lchar;
        n->Rchild=p->Lchild;
        p->Lchar=ch;
        p->Lchild=n;
    } else {
        //printf("C");
        p=p->Lchild;
        while ((p->Rchild != NULL) && (ch > p->Rchar)) p=p->Rchild;
        n->Rchar=p->Rchar;
        n->Rchild=p->Rchild;
        p->Rchar=ch;
        p->Rchild=n;
    }
    //printf(" %x %x %x %x %x %x %d %d\n",p,p->Lchild,p->Lchar,p->Rchild,p->Rchar,p->Parent,len,i);
    if (i==len-1) n->value=value;
    else sma_InsertPattern(n, pattern, len, i+1, value);
}

int sma_StateDepth(smaState p) {
    smaState s; int i;
    s=p; i=0;
    while ((s->Parent != NULL) && (s->Parent != s)) {
        if (s->Parent->Lchild == s) ++i;
        s=s->Parent;
    }
    return i;
}

void sma_SetId(smaTree tree) {
    int id=0;
    smaNode_SetId(tree, &id);
    //printf("setid %d\n",id);
}

void smaNode_SetId(smaState p, int* id) {
    p->id = (*id)++;
    if (p->Lchild != NULL) smaNode_SetId(p->Lchild, id);
    if (p->Rchild != NULL) smaNode_SetId(p->Rchild, id);
}

void sma_BuildFail(smaTree tree) {
    sma_BuildFailF(tree, tree, 0);
}

void sma_BuildFailF(smaTree tree, smaState s, int depth) {
    smaState r,fail; unsigned int a;
    if (depth<=1) s->Fail=tree;
    else {
        r=s->Parent;
        if (r->Lchild == s) a=r->Lchar;
        else {
            r=r->Lchild;
            while (r->Rchild != s) r=r->Rchild;
            a=r->Rchar;
        }
        r=s->Parent;
        while ((r!=NULL) && ((fail=sma_goto(r->Fail,a)) == NULL)) r=r->Parent;
        s->Fail=(fail==NULL)? tree : fail;
    }
    if (s->Lchild != NULL) sma_BuildFailF(tree, s->Lchild, depth+1);
    if (s->Rchild != NULL) sma_BuildFailF(tree, s->Rchild, depth);
}

void sma_dumpXML(smaTree tree, FILE* fd) {
    fprintf(fd, "<?xml version=\"1.0\"?><smaTree xmlns=\"http://ns.yoursunny.com/P2008/VirusScanner/smaTree\">");
    smaNode_dumpXML(tree, fd);
    fprintf(fd, "</smaTree><!--generator: yoursunny.P2008.VirusScanner VirusLibrary SMA Convertor-->");
}

void smaNode_dumpXML(smaNode* node, FILE* fd) {
    fprintf(fd,"<N id=\"%u\" value=\"%u\"",node->id,node->value);
    if (node->Parent != NULL) fprintf(fd," parent=\"%u\"",node->Parent->id);
    fprintf(fd," fail=\"%u\">",node->Fail->id);
    if (node->Lchild!=NULL) {
        fprintf(fd,"<L char=\"%u\">",node->Lchar);
        smaNode_dumpXML(node->Lchild,fd);
        fprintf(fd,"</L>");
    }
    if (node->Rchild!=NULL) {
        fprintf(fd,"<R char=\"%u\">",node->Rchar);
        smaNode_dumpXML(node->Rchild,fd);
        fprintf(fd,"</R>");
    }
    fprintf(fd,"</N>");
}

void sma_dumpText(smaTree tree, FILE* fd) {
    fprintf(fd, "# generator: yoursunny.P2008.VirusScanner VirusLibrary SMA Convertor\n");
    fprintf(fd, "# id,value,Parent,Fail,Lchar,Lchild,Rchar,Rchild\n");
    fprintf(fd, "# HEX numbers, 0 for none\n");
    smaNode_dumpText(tree, fd);
}

void smaNode_dumpText(smaNode* node, FILE* fd) {
    fprintf(fd,"%x,%x,",node->id,node->value);
    if (node->Parent != NULL) fprintf(fd,"%x,",node->Parent->id);
    else fprintf(fd,"0,");
    fprintf(fd,"%x,",node->Fail->id);
    if (node->Lchild!=NULL) fprintf(fd,"%x,%x,",node->Lchar,node->Lchild->id);
    else fprintf(fd,"0,0,");
    if (node->Rchild!=NULL) fprintf(fd,"%x,%x,",node->Rchar,node->Rchild->id);
    else fprintf(fd,"0,0,");
    fprintf(fd,"\n");
    if (node->Lchild!=NULL) smaNode_dumpText(node->Lchild,fd);
    if (node->Rchild!=NULL) smaNode_dumpText(node->Rchild,fd);
}

smaTree sma_loadText(FILE* fd) {
    int list_size; int list_size_new; int i; smaState* list; smaState* list_new;
    char* line; smaState n;
    unsigned int nParent; unsigned int nFail; unsigned int nLchild; unsigned int nRchild;
    //list是id=>smaState的对应表，用list[id]可以取得相应的smaState对象
    list_size=256;
    list=calloc(sizeof(smaState),list_size);
    line=malloc(256);//每行最长256字节，不允许超出
    while (fgets(line,255,fd)>0) {
        if (line[0]=='#') continue;//注释
        n=smaNode_make();
        //读取新状态的信息
        sscanf(line,"%x,%x,%x,%x,%x,%x,%x,%x,",&(n->id),&(n->value),&nParent,&nFail,&(n->Lchar),&nLchild,&(n->Rchar),&nRchild);
        n->Parent=(smaState)nParent;
        n->Fail=(smaState)nFail;
        n->Lchild=(smaState)nLchild;
        n->Rchild=(smaState)nRchild;
        //注意：现在n中Parent、Fail、Lchild、Rchild均为id而不是指针
        if (n->id >= list_size) {//list空间不足，重新分配
            list_size_new=list_size;
            while (n->id >= list_size_new) list_size_new *= 2;
            list_new=calloc(sizeof(smaState),list_size_new);
            memcpy(list_new, list, sizeof(smaState)*list_size);
            free(list);
            list=list_new;
            list_size=list_size_new;
        }
        list[n->id]=n;
        //printf("load %d %d %d %d %d\n",n->id,n->Parent,n->Fail,n->Lchild,n->Rchild);
    }
    for (i=0;(i<list_size) && (list[i]!=NULL);++i) {
        n=list[i];
        n->Parent=list[(int)n->Parent];
        n->Fail=list[(int)n->Fail];
        if (n->Lchild != NULL) {
            n->Lchild=list[(int)n->Lchild];
        }
        if (n->Rchild != NULL) {
            n->Rchild=list[(int)n->Rchild];
        }
    }
    n=list[0];
    free(list); free(line);
    return n;
}

void sma_search(smaTree tree, const char* haystack, int len, sma_callback cb, void* data) {
    smaState p,r; int i; unsigned int ch;
    p=tree;
    //printf("begin search\n");
    for (i=0;i<len;++i) {
        ch=sma_ch2uint(haystack[i]);
        //printf("[%d]=%x %x",i,ch,p->id);
        while ((r=sma_goto(p,ch)) == NULL) {
            if (p->Fail == p) break;
            p=p->Fail;
            //printf("=>%x",p->id);
        }
        //if (r==NULL) printf("=>NULL\n");
        if (r==NULL) continue;
        p=r;
        //printf("=>%x\n",p->id);
        if (p->value != 0) {
            (*cb)(i-sma_StateDepth(p),p->value,data);
            if (p->Fail->value != 0) (*cb)(i-sma_StateDepth(p->Fail),p->Fail->value,data);
        }
    }
}

void sma_search_file(smaTree tree, FILE* haystack, sma_callback cb, void* data) {
    smaState p,r; int i; unsigned int ch;
    p=tree; i=0;
    //printf("begin search file\n");
    while (!feof(haystack)) {
        ch=sma_ch2uint(fgetc(haystack));
        //printf("[%d]=%x %x",i,ch,p->id);
        while ((r=sma_goto(p,ch)) == NULL) {
            if (p->Fail == p) break;
            p=p->Fail;
            //printf("=>%x",p->id);
        }
        //if (r==NULL) printf("=>NULL\n");
        if (r==NULL) continue;
        p=r;
        //printf("=>%x\n",p->id);
        if (p->value != 0) {
            (*cb)(i-sma_StateDepth(p),p->value,data);
            if (p->Fail->value != 0) (*cb)(i-sma_StateDepth(p->Fail),p->Fail->value,data);
        }
        ++i;
    }
}
