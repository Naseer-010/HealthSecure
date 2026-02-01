// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HealthSecureIdentity.sol";

/**
 * @title MedicalRecordRegistry
 * @dev On-chain registry for medical record hashes and IPFS CIDs
 * @notice Provides immutable audit trail for medical records
 */
contract MedicalRecordRegistry {
    
    // Reference to identity contract
    HealthSecureIdentity public identityContract;
    
    // Record types
    enum RecordType { 
        PRESCRIPTION, 
        LAB_REPORT, 
        DIAGNOSIS, 
        IMAGING, 
        PROCEDURE, 
        CONSULTATION, 
        FOLLOWUP 
    }
    
    // Medical record structure (stored on-chain)
    struct RecordEntry {
        bytes32 recordHash;         // Hash of the record content
        string ipfsCid;             // IPFS CID for full record
        address patient;            // Patient's wallet address
        address doctor;             // Doctor who created the record
        RecordType recordType;      // Type of medical record
        bool isVisible;             // Visibility status
        uint256 createdAt;          // Creation timestamp
        bool exists;                // Whether record exists
    }
    
    // Mapping from record ID to record entry
    mapping(uint256 => RecordEntry) public records;
    
    // Current record count (also serves as next ID)
    uint256 public recordCount;
    
    // Mapping from patient address to their record IDs
    mapping(address => uint256[]) public patientRecords;
    
    // Mapping from doctor address to records they created
    mapping(address => uint256[]) public doctorRecords;
    
    // Events
    event RecordCreated(
        uint256 indexed recordId,
        address indexed patient,
        address indexed doctor,
        bytes32 recordHash,
        string ipfsCid,
        RecordType recordType,
        uint256 timestamp
    );
    
    event RecordVisibilityChanged(
        uint256 indexed recordId,
        address indexed patient,
        bool isVisible,
        uint256 timestamp
    );
    
    event RecordVerified(
        uint256 indexed recordId,
        address indexed verifier,
        bool isValid,
        uint256 timestamp
    );
    
    constructor(address _identityContract) {
        identityContract = HealthSecureIdentity(_identityContract);
    }
    
    /**
     * @dev Create a new medical record (doctors only)
     * @param patientAddress Patient's wallet address
     * @param recordHash SHA256 hash of record content
     * @param ipfsCid IPFS CID for complete record
     * @param recordType Type of medical record
     */
    function createRecord(
        address patientAddress,
        bytes32 recordHash,
        string calldata ipfsCid,
        RecordType recordType
    ) external returns (uint256) {
        // Verify caller is a verified doctor
        require(
            identityContract.isVerifiedDoctor(msg.sender),
            "Only verified doctors can create records"
        );
        
        // Verify patient exists
        require(
            identityContract.isPatient(patientAddress),
            "Patient not registered"
        );
        
        // Create record
        uint256 recordId = recordCount;
        records[recordId] = RecordEntry({
            recordHash: recordHash,
            ipfsCid: ipfsCid,
            patient: patientAddress,
            doctor: msg.sender,
            recordType: recordType,
            isVisible: true,
            createdAt: block.timestamp,
            exists: true
        });
        
        // Add to indexes
        patientRecords[patientAddress].push(recordId);
        doctorRecords[msg.sender].push(recordId);
        
        recordCount++;
        
        emit RecordCreated(
            recordId,
            patientAddress,
            msg.sender,
            recordHash,
            ipfsCid,
            recordType,
            block.timestamp
        );
        
        return recordId;
    }
    
    /**
     * @dev Toggle record visibility (patient only)
     * @param recordId ID of the record to toggle
     */
    function toggleVisibility(uint256 recordId) external {
        require(records[recordId].exists, "Record not found");
        require(records[recordId].patient == msg.sender, "Only patient can toggle visibility");
        
        records[recordId].isVisible = !records[recordId].isVisible;
        
        emit RecordVisibilityChanged(
            recordId,
            msg.sender,
            records[recordId].isVisible,
            block.timestamp
        );
    }
    
    /**
     * @dev Verify a record hash matches stored hash
     * @param recordId ID of the record to verify
     * @param providedHash Hash to verify against
     */
    function verifyRecord(uint256 recordId, bytes32 providedHash) external view returns (bool) {
        require(records[recordId].exists, "Record not found");
        return records[recordId].recordHash == providedHash;
    }
    
    /**
     * @dev Get record details
     * @param recordId ID of the record
     */
    function getRecord(uint256 recordId) external view returns (
        bytes32 recordHash,
        string memory ipfsCid,
        address patient,
        address doctor,
        RecordType recordType,
        bool isVisible,
        uint256 createdAt
    ) {
        require(records[recordId].exists, "Record not found");
        RecordEntry memory record = records[recordId];
        
        // Check access: patient, doctor who created it, or if visible
        require(
            record.patient == msg.sender || 
            record.doctor == msg.sender || 
            record.isVisible,
            "Access denied"
        );
        
        return (
            record.recordHash,
            record.ipfsCid,
            record.patient,
            record.doctor,
            record.recordType,
            record.isVisible,
            record.createdAt
        );
    }
    
    /**
     * @dev Get all record IDs for a patient
     * @param patient Patient's wallet address
     */
    function getPatientRecordIds(address patient) external view returns (uint256[] memory) {
        return patientRecords[patient];
    }
    
    /**
     * @dev Get all record IDs created by a doctor
     * @param doctor Doctor's wallet address
     */
    function getDoctorRecordIds(address doctor) external view returns (uint256[] memory) {
        return doctorRecords[doctor];
    }
    
    /**
     * @dev Get visible records for a patient (for doctors searching)
     * @param patient Patient's wallet address
     */
    function getVisiblePatientRecords(address patient) external view returns (uint256[] memory) {
        uint256[] memory allRecords = patientRecords[patient];
        uint256 visibleCount = 0;
        
        // Count visible records
        for (uint256 i = 0; i < allRecords.length; i++) {
            if (records[allRecords[i]].isVisible) {
                visibleCount++;
            }
        }
        
        // Create array of visible record IDs
        uint256[] memory visibleRecords = new uint256[](visibleCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allRecords.length; i++) {
            if (records[allRecords[i]].isVisible) {
                visibleRecords[index] = allRecords[i];
                index++;
            }
        }
        
        return visibleRecords;
    }
    
    /**
     * @dev Get total record count
     */
    function getTotalRecords() external view returns (uint256) {
        return recordCount;
    }
}
