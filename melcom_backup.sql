-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: Melcom
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `BranchID` int NOT NULL,
  `ManagerID` int DEFAULT NULL,
  `Location` varchar(255) NOT NULL,
  PRIMARY KEY (`BranchID`),
  KEY `FK_Branch_Manager` (`ManagerID`),
  CONSTRAINT `FK_Branch_Manager` FOREIGN KEY (`ManagerID`) REFERENCES `employee` (`EmployeeID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CHK_Location` CHECK ((`Location` <> _utf8mb4''))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES (1,1,'Accra'),(2,2,'Kumasi'),(3,3,'Tema'),(4,4,'Takoradi'),(5,5,'Cape Coast');
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `CustomerID` int NOT NULL,
  `LoyaltyPoints` int DEFAULT '0',
  `Address` varchar(255) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`CustomerID`),
  CONSTRAINT `CHK_Address` CHECK ((`Address` <> _cp850'')),
  CONSTRAINT `CHK_Email` CHECK ((`Email` like _cp850'%@%.%')),
  CONSTRAINT `CHK_LoyaltyPoints` CHECK ((`LoyaltyPoints` >= 0)),
  CONSTRAINT `CHK_Name` CHECK ((`Name` <> _cp850''))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,100,'123 Main St, Accra','John Doe','0241234567','john@example.com'),(2,50,'456 High St, Kumasi','Jane Smith','0242345678','jane@example.com'),(3,200,'789 Market St, Tema','Bob Johnson','0243456789','bob@example.com'),(4,75,'321 Beach Rd, Takoradi','Alice Brown','0244567890','alice@example.com'),(5,150,'654 Hill Ave, Cape Coast','Charlie Wilson','0245678901','charlie@example.com');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `DepartmentID` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` text,
  `BranchID` int DEFAULT NULL,
  PRIMARY KEY (`DepartmentID`),
  KEY `FK_Department_Branch` (`BranchID`),
  CONSTRAINT `FK_Department_Branch` FOREIGN KEY (`BranchID`) REFERENCES `branch` (`BranchID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CHK_DepartmentName` CHECK ((`Name` <> _cp850''))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Sales','Handles sales',1),(2,'HR','Human Resources',2),(3,'Inventory','Manages stock',3),(4,'Finance','Handles payments',4),(5,'Marketing','Promotes products',5);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `EmployeeID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Position` varchar(50) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `BranchID` int DEFAULT NULL,
  PRIMARY KEY (`EmployeeID`),
  KEY `FK_Employee_Branch` (`BranchID`),
  CONSTRAINT `FK_Employee_Branch` FOREIGN KEY (`BranchID`) REFERENCES `branch` (`BranchID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CHK_EmployeeName` CHECK ((`Name` <> _cp850'')),
  CONSTRAINT `CHK_Position` CHECK ((`Position` <> _cp850''))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Esi Amoah','Manager','0301234567',1),(2,'Kojo Danso','Manager','0302345678',2),(3,'Akua Yeboah','Manager','0303456789',3),(4,'Kwesi Appiah','Manager','0304567890',4),(5,'Abena Mensah','Manager','0305678901',5);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `InventoryID` int NOT NULL,
  `ProductID` int DEFAULT NULL,
  `Quantity` int NOT NULL,
  PRIMARY KEY (`InventoryID`),
  KEY `FK_Inventory_Product` (`ProductID`),
  CONSTRAINT `FK_Inventory_Product` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CHK_InventoryQuantity` CHECK ((`Quantity` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,1,10),(2,2,50),(3,3,100),(4,4,20),(5,5,30);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `OrderID` int NOT NULL,
  `CustomerID` int DEFAULT NULL,
  `EmployeeID` int DEFAULT NULL,
  `OrderDate` date NOT NULL,
  `DeliveryDate` date DEFAULT NULL,
  `Status` varchar(20) NOT NULL,
  `ProductID` int DEFAULT NULL,
  `Quantity` int NOT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `FK_Order_Customer` (`CustomerID`),
  KEY `FK_Order_Employee` (`EmployeeID`),
  KEY `FK_Order_Product` (`ProductID`),
  CONSTRAINT `FK_Order_Customer` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Order_Employee` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Order_Product` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CHK_OrderDates` CHECK (((`DeliveryDate` is null) or (`DeliveryDate` >= `OrderDate`))),
  CONSTRAINT `CHK_OrderQuantity` CHECK ((`Quantity` > 0)),
  CONSTRAINT `CHK_OrderStatus` CHECK ((`Status` in (_cp850'Pending',_cp850'Shipped',_cp850'Delivered',_cp850'Cancelled')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,1,1,'2024-10-01','2024-10-05','Delivered',1,1),(2,2,2,'2024-10-02','2024-10-06','Delivered',2,2),(3,3,3,'2024-10-03','2024-10-07','Delivered',3,5),(4,4,4,'2024-10-04','2024-10-08','Delivered',4,2),(5,5,5,'2024-10-05','2024-10-09','Delivered',5,3);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll` (
  `PayrollID` int NOT NULL,
  `EmployeeID` int DEFAULT NULL,
  `Salary` decimal(10,2) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date DEFAULT NULL,
  PRIMARY KEY (`PayrollID`),
  KEY `FK_Payroll_Employee` (`EmployeeID`),
  CONSTRAINT `FK_Payroll_Employee` FOREIGN KEY (`EmployeeID`) REFERENCES `employee` (`EmployeeID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CHK_Dates` CHECK (((`EndDate` is null) or (`EndDate` > `StartDate`))),
  CONSTRAINT `CHK_Salary` CHECK ((`Salary` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
INSERT INTO `payroll` VALUES (1,1,2000.00,'2024-01-01','2024-12-31'),(2,2,2000.00,'2024-01-01','2024-12-31'),(3,3,2000.00,'2024-01-01','2024-12-31'),(4,4,2000.00,'2024-01-01','2024-12-31'),(5,5,2000.00,'2024-01-01','2024-12-31');
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `ProductID` int NOT NULL,
  `ProductName` varchar(100) NOT NULL,
  `CategoryID` int DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `QuantityInStock` int NOT NULL,
  `SupplierID` int DEFAULT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `FK_Product_Category` (`CategoryID`),
  KEY `FK_Product_Supplier` (`SupplierID`),
  CONSTRAINT `FK_Product_Category` FOREIGN KEY (`CategoryID`) REFERENCES `productcategory` (`CategoryID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Product_Supplier` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`SupplierID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CHK_Price` CHECK ((`Price` > 0)),
  CONSTRAINT `CHK_ProductName` CHECK ((`ProductName` <> _cp850'')),
  CONSTRAINT `CHK_QuantityInStock` CHECK ((`QuantityInStock` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Laptop',1,1500.00,10,1),(2,'T-Shirt',2,20.00,50,2),(3,'Rice Bag',3,15.00,100,3),(4,'Chair',4,50.00,20,4),(5,'Teddy Bear',5,10.00,30,5);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productcategory`
--

DROP TABLE IF EXISTS `productcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productcategory` (
  `CategoryID` int NOT NULL,
  `CategoryName` varchar(50) NOT NULL,
  PRIMARY KEY (`CategoryID`),
  CONSTRAINT `CHK_CategoryName` CHECK ((`CategoryName` <> _cp850''))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productcategory`
--

LOCK TABLES `productcategory` WRITE;
/*!40000 ALTER TABLE `productcategory` DISABLE KEYS */;
INSERT INTO `productcategory` VALUES (1,'Electronics'),(2,'Clothing'),(3,'Groceries'),(4,'Furniture'),(5,'Toys');
/*!40000 ALTER TABLE `productcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `SupplierID` int NOT NULL,
  `SupplierName` varchar(100) NOT NULL,
  `ContactDetails` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`SupplierID`),
  CONSTRAINT `CHK_SupplierName` CHECK ((`SupplierName` <> _cp850''))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'TechTrend Innovations','tech@trend.com'),(2,'FashionHub','contact@fashionhub.com'),(3,'GroceryMart','info@grocerymart.com'),(4,'FurnitureWorld','sales@furnitureworld.com'),(5,'ToyGalaxy','support@toygalaxy.com');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `TransactionID` int NOT NULL,
  `OrderID` int DEFAULT NULL,
  `CustomerID` int DEFAULT NULL,
  `PaymentType` varchar(50) NOT NULL,
  `TotalAmount` decimal(10,2) NOT NULL,
  `Date` date NOT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `FK_Transaction_Order` (`OrderID`),
  KEY `FK_Transaction_Customer` (`CustomerID`),
  CONSTRAINT `FK_Transaction_Customer` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`CustomerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Transaction_Order` FOREIGN KEY (`OrderID`) REFERENCES `order` (`OrderID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CHK_PaymentType` CHECK ((`PaymentType` in (_cp850'Cash',_cp850'Credit',_cp850'Debit',_cp850'Online'))),
  CONSTRAINT `CHK_TotalAmount` CHECK ((`TotalAmount` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,1,1,'Credit',1500.00,'2024-10-01'),(2,2,2,'Cash',40.00,'2024-10-02'),(3,3,3,'Debit',75.00,'2024-10-03'),(4,4,4,'Online',100.00,'2024-10-04'),(5,5,5,'Credit',30.00,'2024-10-05');
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-26 23:36:04
