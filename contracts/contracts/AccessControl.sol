// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HealthSecureIdentity.sol";

/**
 * @title AccessControl
 * @dev Manages patient-doctor access permissions for HealthSecure
 * @notice Patients can grant/revoke access to specific doctors
 */
contract AccessControl {
    
    // Reference to identity contract
    HealthSecureIdentity public identityContract;
    
    // Access grant structure
    struct AccessGrant {
        bool isGranted;             // Whether access is currently granted
        uint256 grantedAt;          // When access was granted
        uint256 expiresAt;          // When access expires (0 = never)
        bool exists;                // Whether grant record exists
    }
    
    // Mapping: patient => doctor => access grant
    mapping(address => mapping(address => AccessGrant)) public accessGrants;
    
    // Mapping: patient => list of doctors with access
    mapping(address => address[]) public patientDoctors;
    
    // Mapping: doctor => list of patients who granted access
    mapping(address => address[]) public doctorPatients;
    
    // Events
    event AccessGranted(
        address indexed patient,
        address indexed doctor,
        uint256 grantedAt,
        uint256 expiresAt
    );
    
    event AccessRevoked(
        address indexed patient,
        address indexed doctor,
        uint256 revokedAt
    );
    
    event EmergencyAccessGranted(
        address indexed patient,
        address indexed doctor,
        string reason,
        uint256 timestamp
    );
    
    constructor(address _identityContract) {
        identityContract = HealthSecureIdentity(_identityContract);
    }
    
    /**
     * @dev Grant access to a doctor
     * @param doctorAddress Doctor's wallet address
     * @param durationSeconds Duration of access (0 = permanent until revoked)
     */
    function grantAccess(address doctorAddress, uint256 durationSeconds) external {
        // Verify caller is a patient
        require(
            identityContract.isPatient(msg.sender),
            "Only patients can grant access"
        );
        
        // Verify target is a verified doctor
        require(
            identityContract.isVerifiedDoctor(doctorAddress),
            "Target is not a verified doctor"
        );
        
        uint256 expiresAt = durationSeconds > 0 
            ? block.timestamp + durationSeconds 
            : 0;
        
        // Check if this is a new grant
        bool isNewGrant = !accessGrants[msg.sender][doctorAddress].exists;
        
        accessGrants[msg.sender][doctorAddress] = AccessGrant({
            isGranted: true,
            grantedAt: block.timestamp,
            expiresAt: expiresAt,
            exists: true
        });
        
        // Add to lists if new grant
        if (isNewGrant) {
            patientDoctors[msg.sender].push(doctorAddress);
            doctorPatients[doctorAddress].push(msg.sender);
        }
        
        emit AccessGranted(msg.sender, doctorAddress, block.timestamp, expiresAt);
    }
    
    /**
     * @dev Revoke access from a doctor
     * @param doctorAddress Doctor's wallet address
     */
    function revokeAccess(address doctorAddress) external {
        require(
            identityContract.isPatient(msg.sender),
            "Only patients can revoke access"
        );
        
        require(
            accessGrants[msg.sender][doctorAddress].exists,
            "No access grant found"
        );
        
        accessGrants[msg.sender][doctorAddress].isGranted = false;
        
        emit AccessRevoked(msg.sender, doctorAddress, block.timestamp);
    }
    
    /**
     * @dev Check if a doctor has access to a patient's records
     * @param patientAddress Patient's wallet address
     * @param doctorAddress Doctor's wallet address
     */
    function hasAccess(address patientAddress, address doctorAddress) external view returns (bool) {
        AccessGrant memory grant = accessGrants[patientAddress][doctorAddress];
        
        if (!grant.exists || !grant.isGranted) {
            return false;
        }
        
        // Check if expired
        if (grant.expiresAt > 0 && block.timestamp > grant.expiresAt) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @dev Get access grant details
     * @param patientAddress Patient's wallet address
     * @param doctorAddress Doctor's wallet address
     */
    function getAccessGrant(
        address patientAddress, 
        address doctorAddress
    ) external view returns (
        bool isGranted,
        uint256 grantedAt,
        uint256 expiresAt,
        bool isExpired
    ) {
        AccessGrant memory grant = accessGrants[patientAddress][doctorAddress];
        
        bool expired = grant.expiresAt > 0 && block.timestamp > grant.expiresAt;
        
        return (
            grant.isGranted && !expired,
            grant.grantedAt,
            grant.expiresAt,
            expired
        );
    }
    
    /**
     * @dev Get all doctors a patient has granted access to
     * @param patientAddress Patient's wallet address
     */
    function getPatientDoctors(address patientAddress) external view returns (address[] memory) {
        return patientDoctors[patientAddress];
    }
    
    /**
     * @dev Get all patients who have granted access to a doctor
     * @param doctorAddress Doctor's wallet address
     */
    function getDoctorPatients(address doctorAddress) external view returns (address[] memory) {
        return doctorPatients[doctorAddress];
    }
    
    /**
     * @dev Get count of active access grants for a doctor
     * @param doctorAddress Doctor's wallet address
     */
    function getActivePatientCount(address doctorAddress) external view returns (uint256) {
        address[] memory patients = doctorPatients[doctorAddress];
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < patients.length; i++) {
            AccessGrant memory grant = accessGrants[patients[i]][doctorAddress];
            if (grant.isGranted) {
                if (grant.expiresAt == 0 || block.timestamp <= grant.expiresAt) {
                    activeCount++;
                }
            }
        }
        
        return activeCount;
    }
}
