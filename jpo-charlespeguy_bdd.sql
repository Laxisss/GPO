-- phpMyAdmin SQL Dump
-- version 5.1.4
-- https://www.phpmyadmin.net/
--
-- Host: mysql-jpo-charlespeguy.alwaysdata.net
-- Generation Time: Jun 06, 2022 at 08:54 PM
-- Server version: 10.6.5-MariaDB
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jpo-charlespeguy_bdd`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`259670_admin`@`%` PROCEDURE `change_passwd` (IN `newPswd` VARCHAR(50), IN `compteId` INT)   BEGIN
		UPDATE comptes SET comptes.MotDePasse = SHA(newPswd) WHERE comptes.ID_Comptes = compteId;
	END$$

CREATE DEFINER=`259670_admin`@`%` PROCEDURE `giveModel` (IN `idModele` INT)   BEGIN
    	DECLARE done bool DEFAULT FALSE;
        DECLARE idQues INT;
        DECLARE occurences INT;
        DECLARE cur1 CURSOR FOR SELECT questions.ID_Question FROM questions;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
        
        OPEN cur1;
        read_loop: LOOP
        	FETCH cur1 INTO idQues;
        	IF done THEN
            	LEAVE read_loop;
            END IF;
            SELECT COUNT(*) INTO occurences 
            FROM appartenir 
            WHERE ID_Question = idQues AND ID_Modele = idModele;
            IF occurences = 0 THEN
            	INSERT INTO appartenir(appartenir.ID_Question, appartenir.ID_Modele) 
                VALUES (idQues, idModele);
            END IF;
        END LOOP;
    END$$

CREATE DEFINER=`259670_admin`@`%` PROCEDURE `insertChoix` (IN `lechoix` VARCHAR(50), IN `numquestion` INT)   BEGIN
    	INSERT INTO `choix`(`NomChoix`, `ID_Question`) VALUES (lechoix,numquestion);
    END$$

CREATE DEFINER=`259670_admin`@`%` PROCEDURE `insertQuestion` (IN `laquestion` VARCHAR(50), IN `lordre` INT, IN `typeduchoix` INT)   BEGIN
		DECLARE maxId INT;
        SELECT MAX(ID_Question) + 1 INTO maxId FROM questions;
    	INSERT INTO `questions`(`ID_Question`,`Question`, `Ordre`, `ID_TypeChoix`) VALUES (maxId,laquestion,lordre,typeduchoix);
        SELECT MAX(questions.ID_Question) FROM questions;
    END$$

CREATE DEFINER=`259670_admin`@`%` PROCEDURE `insertUser` (IN `email` VARCHAR(50), IN `isActive` BOOLEAN, IN `isAdmin` BOOLEAN, IN `motDePasse` VARCHAR(50), IN `nom` VARCHAR(50), IN `prenom` VARCHAR(50), IN `Classe` VARCHAR(50))   BEGIN
	DECLARE classeId INT;
    DECLARE maxId INT;
    SELECT classes.ID_Classe INTO classeId FROM classes
    WHERE classes.Libelle LIKE CONCAT('%',Classe);
    INSERT INTO comptes(`AdresseMail`,`isActive`,`isAdmin`,`MotDePasse`,`Nom`,`Prenom`) VALUES (email,isActive,isAdmin,SHA(motDePasse),nom,prenom);
    SELECT MAX(ID_Comptes) INTO maxId FROM comptes;
    INSERT INTO etre_dans_classe(`ID_Classe`,`ID_Comptes`,`Annee`) VALUES (classeId, maxId,CONCAT(YEAR(NOW()),'-',YEAR(NOW())-1));
    SELECT * FROM comptes;
	END$$

CREATE DEFINER=`259670_admin`@`%` PROCEDURE `reset_passwd` (IN `NewMdp` VARCHAR(50), IN `CompteId` INT)   BEGIN
		UPDATE comptes SET comptes.MotDePasse = SHA(newPswd), comptes.MustChangePswd = 1 WHERE comptes.ID_Comptes = compteId;
END$$

--
-- Functions
--
CREATE DEFINER=`259670_admin`@`%` FUNCTION `getPrimeQuesOfQuestion` (`idChild` INT) RETURNS INT(11)  BEGIN
	DECLARE returnValue INT;
	SELECT Q.ID_Question INTO returnValue
	FROM questions
    LEFT JOIN etre_question_de E ON E.ID_Question = questions.ID_Question
    LEFT JOIN choix C ON E.ID_Choix = C.ID_Choix
    LEFT JOIN questions Q ON C.ID_Question = Q.ID_Question
    WHERE questions.ID_Question = idChild LIMIT 1;
    WHILE (returnValue NOT IN (SELECT Q.ID_Question FROM `questions` AS Q
    	WHERE Q.ID_Question NOT IN (SELECT ID_Question FROM etre_question_de) 
    	GROUP BY Q.ID_Question ORDER BY Q.Ordre, Q.ID_Question ASC)) DO
    		SELECT Q.ID_Question INTO returnValue
			FROM questions
    		LEFT JOIN etre_question_de E ON E.ID_Question = questions.ID_Question
    		LEFT JOIN choix C ON E.ID_Choix = C.ID_Choix
   			LEFT JOIN questions Q ON C.ID_Question = Q.ID_Question
    		WHERE questions.ID_Question = returnValue LIMIT 1;
    END WHILE;
    RETURN IFNULL(returnValue,idChild);
END$$

CREATE DEFINER=`259670_admin`@`%` FUNCTION `verifyUser` (`email` VARCHAR(50), `passwd` VARCHAR(50)) RETURNS INT(11)  BEGIN
    	DECLARE number INT;
    	SELECT count(*) INTO number FROM comptes WHERE comptes.AdresseMail = LCASE(email) AND comptes.MotDePasse = SHA(passwd);
        RETURN number;
    END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `appartenir`
--

CREATE TABLE `appartenir` (
  `ID_Modele` int(11) NOT NULL,
  `ID_Question` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `appartenir`
--


-- --------------------------------------------------------

--
-- Table structure for table `choix`
--

CREATE TABLE `choix` (
  `ID_Choix` int(11) NOT NULL,
  `NomChoix` varchar(50) COLLATE utf8mb3_bin NOT NULL,
  `ID_Question` int(11) NOT NULL,
  `estQuestionDe` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `choix`
--


-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `ID_Classe` int(11) NOT NULL,
  `Libelle` varchar(50) COLLATE utf8mb3_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `classes`
--

-- --------------------------------------------------------

--
-- Table structure for table `comptes`
--

CREATE TABLE `comptes` (
  `ID_Comptes` int(11) NOT NULL,
  `Nom` varchar(50) COLLATE utf8mb3_bin NOT NULL,
  `Prenom` varchar(50) COLLATE utf8mb3_bin NOT NULL,
  `AdresseMail` varchar(50) COLLATE utf8mb3_bin NOT NULL,
  `MotDePasse` varchar(100) COLLATE utf8mb3_bin NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `MustChangePswd` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `comptes`
--

-- --------------------------------------------------------

--
-- Table structure for table `etre_dans_classe`
--

CREATE TABLE `etre_dans_classe` (
  `ID_Classe` int(11) NOT NULL,
  `ID_Comptes` int(11) NOT NULL,
  `Annee` varchar(9) COLLATE utf8mb3_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `etre_dans_classe`
--

-- --------------------------------------------------------

--
-- Table structure for table `etre_question_de`
--

CREATE TABLE `etre_question_de` (
  `ID_Question` int(11) NOT NULL,
  `ID_Choix` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `etre_question_de`
--

-- --------------------------------------------------------

--
-- Table structure for table `formulaire`
--

CREATE TABLE `formulaire` (
  `ID_Formulaire` int(11) NOT NULL,
  `ID_Modele` int(11) NOT NULL,
  `ID_Comptes` int(11) NOT NULL,
  `Date_Envoi` date DEFAULT NULL,
  `Heure_Envoi` varchar(2) COLLATE utf8mb3_bin DEFAULT NULL,
  `Minute_Envoi` varchar(2) COLLATE utf8mb3_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `formulaire`
--

--
-- Triggers `formulaire`
--
DELIMITER $$
CREATE TRIGGER `deleteCorrespondingQuestions` BEFORE DELETE ON `formulaire` FOR EACH ROW BEGIN
    	DELETE FROM reponses WHERE reponses.ID_Formulaire = old.ID_Formulaire;
    END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `modeles`
--

CREATE TABLE `modeles` (
  `ID_Modele` int(11) NOT NULL,
  `Libelle` varchar(50) COLLATE utf8mb3_bin NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `modeles`
--

--
-- Triggers `modeles`
--
DELIMITER $$
CREATE TRIGGER `manageActiveModels` BEFORE INSERT ON `modeles` FOR EACH ROW BEGIN
    	IF new.isActive = 1
        THEN
    		UPDATE modeles SET isActive = 0 WHERE isActive = 1;
        END IF;
   	END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `ID_Question` int(11) NOT NULL,
  `Question` varchar(100) COLLATE utf8mb3_bin DEFAULT NULL,
  `Ordre` int(11) NOT NULL,
  `ID_TypeChoix` int(3) DEFAULT NULL,
  `Obligatoire` tinyint(1) DEFAULT 0,
  `ChoixSource` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `questions`
--

-- --------------------------------------------------------

--
-- Table structure for table `reponses`
--

CREATE TABLE `reponses` (
  `ID_Reponses` int(11) NOT NULL,
  `Reponse` varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
  `ID_Question` int(11) NOT NULL,
  `ID_Formulaire` int(11) NOT NULL,
  `ID_Comptes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `reponses`
--

-- --------------------------------------------------------

--
-- Table structure for table `typechoix`
--

CREATE TABLE `typechoix` (
  `ID_TypeChoix` int(3) NOT NULL,
  `Libelle` varchar(50) COLLATE utf8mb3_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

--
-- Dumping data for table `typechoix`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appartenir`
--
ALTER TABLE `appartenir`
  ADD PRIMARY KEY (`ID_Modele`,`ID_Question`),
  ADD KEY `Appartenir_Questions0_FK` (`ID_Question`);

--
-- Indexes for table `choix`
--
ALTER TABLE `choix`
  ADD PRIMARY KEY (`ID_Choix`),
  ADD KEY `Choix_Questions_FK` (`ID_Question`),
  ADD KEY `estQuestionDe` (`estQuestionDe`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`ID_Classe`);

--
-- Indexes for table `comptes`
--
ALTER TABLE `comptes`
  ADD PRIMARY KEY (`ID_Comptes`);

--
-- Indexes for table `etre_dans_classe`
--
ALTER TABLE `etre_dans_classe`
  ADD PRIMARY KEY (`ID_Classe`,`ID_Comptes`),
  ADD KEY `Etre_dans_classe_Comptes0_FK` (`ID_Comptes`);

--
-- Indexes for table `etre_question_de`
--
ALTER TABLE `etre_question_de`
  ADD PRIMARY KEY (`ID_Question`,`ID_Choix`),
  ADD KEY `Etre_Question_De_Choix0_FK` (`ID_Choix`);

--
-- Indexes for table `formulaire`
--
ALTER TABLE `formulaire`
  ADD PRIMARY KEY (`ID_Formulaire`,`ID_Comptes`),
  ADD KEY `Formulaire_Modeles_FK` (`ID_Modele`),
  ADD KEY `ID_Comptes` (`ID_Comptes`);

--
-- Indexes for table `modeles`
--
ALTER TABLE `modeles`
  ADD PRIMARY KEY (`ID_Modele`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`ID_Question`),
  ADD KEY `ID_TypeChoix` (`ID_TypeChoix`),
  ADD KEY `ChoixSource` (`ChoixSource`);

--
-- Indexes for table `reponses`
--
ALTER TABLE `reponses`
  ADD PRIMARY KEY (`ID_Reponses`,`ID_Formulaire`,`ID_Comptes`),
  ADD KEY `Reponses_Questions_FK` (`ID_Question`),
  ADD KEY `Reponses_Formulaire0_FK` (`ID_Formulaire`),
  ADD KEY `ID_Comptes` (`ID_Comptes`);

--
-- Indexes for table `typechoix`
--
ALTER TABLE `typechoix`
  ADD PRIMARY KEY (`ID_TypeChoix`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `choix`
--
ALTER TABLE `choix`
  MODIFY `ID_Choix` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `ID_Classe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `comptes`
--
ALTER TABLE `comptes`
  MODIFY `ID_Comptes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `formulaire`
--
ALTER TABLE `formulaire`
  MODIFY `ID_Formulaire` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `choix`
--
ALTER TABLE `choix`
  ADD CONSTRAINT `choix_ibfk_1` FOREIGN KEY (`estQuestionDe`) REFERENCES `questions` (`ID_Question`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`ChoixSource`) REFERENCES `choix` (`ID_Choix`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
