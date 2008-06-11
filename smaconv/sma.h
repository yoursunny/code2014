#ifndef SMATREE_H
#define SMATREE_H

#include <stdio.h>

//二叉树多模式匹配算法

typedef unsigned int smaUserData;

//SMA算法二叉树节点
typedef struct smaNode smaNode;
typedef smaNode* smaState;
struct smaNode {
    unsigned int id;
    unsigned int Lchar;
    smaState Lchild;
    unsigned int Rchar;
    smaState Rchild;
    smaState Parent;//SMA意义上的父节点
    smaState Fail;
    smaUserData value;//用户数据
};

typedef smaNode* smaTree;

//创建新的SMA有序二叉树节点
smaNode* smaNode_make();
//释放SMA有序二叉树节点及其所有后代内存
void smaNode_destroy(smaNode* n);

//根据访问规则从状态p出发到子状态child时，若栈中有且只有ch，则返回child
smaState sma_goto(smaState p, unsigned int ch);
//向有序二叉树添加一个pattern
//len: pattern长度(pattern中允许出现0x00)
void sma_AddPattern(smaTree tree, const char* pattern, int len, smaUserData value);
//向一个模式的前缀节点添加该模式的后缀
void sma_InsertPattern(smaState p, const char* pattern, int len, int i, smaUserData value);
//计算状态深度
int sma_StateDepth(smaState p);
//创建节点编号
void sma_SetId(smaTree tree);
//创建p节点及以下的编号
void smaNode_SetId(smaState p, int* id);
//创建失败指针
void sma_BuildFail(smaTree tree);
//创建p状态及以下的失败指针
void sma_BuildFailF(smaTree tree, smaState p, int depth);

//字符扩展成无符号整数
#define sma_ch2uint(ch) ((unsigned int)(ch&0xff))
//将有序二叉树输出为XML流
void sma_dumpXML(smaTree tree, FILE* fd);
//将有序二叉树节点输出为XML流
void smaNode_dumpXML(smaNode* node, FILE* fd);
//将有序二叉树输出为文本流
void sma_dumpText(smaTree tree, FILE* fd);
//将有序二叉树节点输出为文本流
void smaNode_dumpText(smaNode* node, FILE* fd);
//从文本流读取有序二叉树
smaTree sma_loadText(FILE* fd);

//查找回调函数，参数为(找到位置,用户数据,传入sma_search的数据)
typedef void (*sma_callback)(int index, smaUserData value, void* data);
//从输入字符串中查找有序二叉树中的模式
void sma_search(smaTree tree, const char* haystack, int len, sma_callback cb, void* data);
//从输入文件中查找有序二叉树中的模式
void sma_search_file(smaTree tree, FILE* haystack, sma_callback cb, void* data);

#endif // SMATREE_H
