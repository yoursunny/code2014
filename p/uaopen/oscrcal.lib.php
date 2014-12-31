<?php
require_once 'common.func.php';

class OSCRCal {
	public $locid;
	public $starttime;
	public $endtime;

	private $cal;

	function __construct($locid) {
		$this->locid = $locid;
		$this->fetch();
	}

	private function fetch() {
		$this->endtime = strtotime('next Sunday');
		$this->starttime = $this->endtime - 604800;
		$u = sprintf('http://uits.arizona.edu/departments/oscr/locations/calendar_feed?loc_id=%d&start=%d&end=%d',$this->locid,$this->starttime,$this->endtime);
		$json = cached_load(sprintf('oscr_%d',$this->locid),$u);
		$this->cal = json_decode($json,FALSE);
		foreach ($this->cal as $resv) {
			$resv->starttime = strtotime($resv->start);
			$resv->endtime = strtotime($resv->end);
		}
	}

	private function resv_end($time) {//return reservation end time if the time is reserved, otherwise FALSE
		foreach ($this->cal as $resv) {
			if ($resv->starttime <= $time && $time < $resv->endtime) return $resv->endtime;
		}
		return FALSE;
	}

	private function next_close($time) {//find next reservation start time, or week end time
		$nextclose = $this->endtime;
		foreach ($this->cal as $resv) {
			if ($resv->starttime > $time) $nextclose = min($nextclose,$resv->starttime);
		}
		return $nextclose;
	}

	public function query($time) {//return array(TRUE,close_time) if currently open, or array(open_time,close_time) if currently closed, or array(FALSE,FALSE) if closed for reset of week
		$resvend = $this->resv_end($time);
		if ($resvend) {//currently closed
			do {
				if ($resvend + 60 > $this->endtime) return array(FALSE,FALSE);
				$nextopen = $resvend;
				$resvend = $this->resv_end($nextopen + 60);
				//overlapping / adjacent reservations
			} while ($resvend!==FALSE);
			return array($nextopen,$this->next_close($nextopen));
		} else {
			return array(TRUE,$this->next_close($time));
		}
	}
};

$OSCRLabs = array(
	array('Campus Rec Lab','campusrec','campus_rec'),
	array('ECE 229',45,'ece-229'),
	array('ENGR 318',47,'engr-318'),
	array('LaPaz s107',71,'la-paz'),
	array('McClelland Park 102',454,'mc-clelland-park'),
	array('Nugent 15b',74,'nugent'),
	array('Multimedia Learning Lab',42,'multimedia-learning-lab'),
	array('Multimedia Zone','mainlib','multimedia-zone'),
);

?>
