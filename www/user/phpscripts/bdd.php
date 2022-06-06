<?php
    session_start();
		header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: *");
    function getLink(){
        $host = FileManager::getHost();
        $user = FileManager::getUser();
        $password = FileManager::getPswd();
        $db = FileManager::getDb();
        $link = mysqli_connect($host,$user,$password,$db);
        return $link;
    }
    function insertForm($param){
        $liaison = getLink();
        $query = "INSERT INTO `formulaire`(`ID_Formulaire`,`ID_Modele`,`ID_Comptes`,`Date_Envoi`,`Heure_Envoi`,`Minute_Envoi`) VALUES ($param,1,".$_SESSION['ID'].",'".date('Y-m-d')."','".date('H')."','".date('i')."')";
        $exe = mysqli_query($liaison,$query);
        return $query;
    }

    class FileManager{
        public static function getConfig(){
			return file('../../config.config');
		}
		public static function getHost(){
			$file = FileManager::getConfig();
			$host = explode("'", $file[0], 3);
			return $host[1];
		}
        public static function getUser(){
			$file = FileManager::getConfig();
			$user = explode("'", $file[1], 3);
			return $user[1];
		}
        public static function getPswd(){
			$file = FileManager::getConfig();
			$pswd = explode("'", $file[2], 3);
			return $pswd[1];
		}
        public static function getDb(){
			$file = FileManager::getConfig();
			$db = explode("'", $file[3], 3);
			return $db[1];
		}
        public static function getLevel(){
			$file = FileManager::getConfig();
			$level = explode("'", $file[4], 3);
			return $level[1];
		}
		public static function getPath(){
			$file = FileManager::getConfig();
			$path = explode("'", $file[5], 3);
			return $path[1];
		}
		public static function getMethod(){
			$file = FileManager::getConfig();
			$method = explode("'", $file[6], 3);
			return $method[1];
		}
		public static function getMail(){
			$file = FileManager::getConfig();
			$mail = explode("'", $file[7], 3);
			return $mail[1];
		}
	}
    class Logger{

		private static $level;
		private static $method;
		private static $path;

		public static function init(){
			self::$level = FileManager::getLevel();
			self::$method = FileManager::getMethod();
			self::$path = FileManager::getPath();
		}

		public static function setInfo($message){
			if(!self::checkData()){
				self::init();
			}
			if(self::$level>=3){
				$fileName = self::$path.date('y-m-j')."-new.log";
				file_put_contents($fileName,"[Info]: [".date('H:i:s')."] ".$message."\n",FILE_APPEND);
			}
		}
		public static function setWarn($message){
			if(!self::checkData()){
				self::init();
			}
			if(self::$level>=2){
				$fileName = self::$path.date('y-m-j')."-new.log";
				file_put_contents($fileName,"[Warn]: [".date('H:i:s')."] ".$message."\n",FILE_APPEND);
			}
		}
		public static function setError($message){
			if(!self::checkData()){
				self::init();
			}
			if(self::$level>=1){
				$fileName = self::$path.date('y-m-j')."-new.log";
				file_put_contents($fileName,"[Error]: [".date('H:i:s')."] ".$message."\n",FILE_APPEND);
			}
		}
		public static function setFatal($message){
			if(!self::checkData()){
				self::init();
			}
			if(self::$level>=0){
				$fileName = self::$path.date('y-m-j')."-new.log";
				file_put_contents($fileName,"[Fatal]: [".date('H:i:s')."] ".$message."\n",FILE_APPEND);
			}
		}

		public static function checkData(){
			if( !isset(self::$level) || (isset(self::$level) && (self::$level==null||self::$level=='') )||
			!isset(self::$method) || (isset(self::$method) && (self::$method==null||self::$method=='') )||
			!isset(self::$path) || (isset(self::$path) && (self::$path==null||self::$path=='') )){
				return false;
			}
			return true;
		}
	}

?>