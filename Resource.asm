
// Resource Table
// Created by IDE, Do not modify this table

.TEXT
.public _RES_Table;
.external __RES_SUCCEED_72K_sa
.public _RES_SUCCEED_72K_SA;
.external __RES_SUCCEED_72K_ea;
.public _RES_SUCCEED_72K_EA;
.external __RES_ACCEPT_72K_sa
.public _RES_ACCEPT_72K_SA;
.external __RES_ACCEPT_72K_ea;
.public _RES_ACCEPT_72K_EA;
.external __RES_FAIL_72K_sa
.public _RES_FAIL_72K_SA;
.external __RES_FAIL_72K_ea;
.public _RES_FAIL_72K_EA;
.external __RES_REC_72K_sa
.public _RES_REC_72K_SA;
.external __RES_REC_72K_ea;
.public _RES_REC_72K_EA;


_RES_Table:

_RES_SUCCEED_72K_SA:
	.DW offset __RES_SUCCEED_72K_sa,seg __RES_SUCCEED_72K_sa;
_RES_SUCCEED_72K_EA:
	.DW offset __RES_SUCCEED_72K_ea,seg __RES_SUCCEED_72K_ea;

_RES_ACCEPT_72K_SA:
	.DW offset __RES_ACCEPT_72K_sa,seg __RES_ACCEPT_72K_sa;
_RES_ACCEPT_72K_EA:
	.DW offset __RES_ACCEPT_72K_ea,seg __RES_ACCEPT_72K_ea;

_RES_FAIL_72K_SA:
	.DW offset __RES_FAIL_72K_sa,seg __RES_FAIL_72K_sa;
_RES_FAIL_72K_EA:
	.DW offset __RES_FAIL_72K_ea,seg __RES_FAIL_72K_ea;

_RES_REC_72K_SA:
	.DW offset __RES_REC_72K_sa,seg __RES_REC_72K_sa;
_RES_REC_72K_EA:
	.DW offset __RES_REC_72K_ea,seg __RES_REC_72K_ea;


// End Table
.PUBLIC T_SACM_S480_SpeechTable
T_SACM_S480_SpeechTable:
	.DW _RES_SUCCEED_72K_SA
	.DW _RES_FAIL_72K_SA
	.DW _RES_ACCEPT_72K_SA
	.DW _RES_REC_72K_SA
