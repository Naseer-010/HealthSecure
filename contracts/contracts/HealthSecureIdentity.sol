// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HealthSecureIdentity
 * @dev Manages blockchain-based user identities for HealthSecure platform
 * @notice This contract stores user identity hashes and links to IPFS profiles
 */
contract HealthSecureIdentity is Ownable {
    
    // User roles
    enum Role { NONE, PATIENT, DOCTOR }
    
    // User identity structure
    struct Identity {
        bytes32 identityHash;       // SHA256 hash of user credentials
        Role role;                  // User role (patient or doctor)
        string profileCid;          // IPFS CID for profile metadata
        bool isVerified;            // Verification status (for doctors)
        uint256 registeredAt;       // Registration timestamp
        bool exists;                // Whether identity exists
    }
    
    // Mapping from wallet address to identity
    mapping(address => Identity) public identities;
    
    // Mapping from identity hash to wallet address (for reverse lookup)
    mapping(bytes32 => address) public hashToAddress;
    
    // Mapping from health ID to wallet address (for patients)
    mapping(string => address) public healthIdToAddress;
    
    // Mapping from doctor ID to wallet address (for doctors)
    mapping(string => address) public doctorIdToAddress;
    
    // Events
    event IdentityRegistered(
        address indexed wallet,
        bytes32 indexed identityHash,
        Role role,
        uint256 timestamp
    );
    
    event ProfileUpdated(
        address indexed wallet,
        string newProfileCid
    );
    
    event DoctorVerified(
        address indexed wallet,
        uint256 timestamp
    );
    
    event HealthIdLinked(
        address indexed wallet,
        string healthId
    );
    
    event DoctorIdLinked(
        address indexed wallet,
        string doctorId
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new patient identity
     * @param identityHash SHA256 hash of user credentials
     * @param healthId Unique health ID (e.g., HID-XXXX-YYYY)
     * @param profileCid IPFS CID for profile metadata
     */
    function registerPatient(
        bytes32 identityHash,
        string calldata healthId,
        string calldata profileCid
    ) external {
        require(!identities[msg.sender].exists, "Identity already registered");
        require(hashToAddress[identityHash] == address(0), "Identity hash already used");
        require(healthIdToAddress[healthId] == address(0), "Health ID already used");
        
        identities[msg.sender] = Identity({
            identityHash: identityHash,
            role: Role.PATIENT,
            profileCid: profileCid,
            isVerified: true,  // Patients are auto-verified
            registeredAt: block.timestamp,
            exists: true
        });
        
        hashToAddress[identityHash] = msg.sender;
        healthIdToAddress[healthId] = msg.sender;
        
        emit IdentityRegistered(msg.sender, identityHash, Role.PATIENT, block.timestamp);
        emit HealthIdLinked(msg.sender, healthId);
    }
    
    /**
     * @dev Register a new doctor identity
     * @param identityHash SHA256 hash of user credentials
     * @param doctorId Unique doctor ID (e.g., DOC-XXXX-YYYY)
     * @param profileCid IPFS CID for profile metadata
     */
    function registerDoctor(
        bytes32 identityHash,
        string calldata doctorId,
        string calldata profileCid
    ) external {
        require(!identities[msg.sender].exists, "Identity already registered");
        require(hashToAddress[identityHash] == address(0), "Identity hash already used");
        require(doctorIdToAddress[doctorId] == address(0), "Doctor ID already used");
        
        identities[msg.sender] = Identity({
            identityHash: identityHash,
            role: Role.DOCTOR,
            profileCid: profileCid,
            isVerified: false,  // Doctors require verification
            registeredAt: block.timestamp,
            exists: true
        });
        
        hashToAddress[identityHash] = msg.sender;
        doctorIdToAddress[doctorId] = msg.sender;
        
        emit IdentityRegistered(msg.sender, identityHash, Role.DOCTOR, block.timestamp);
        emit DoctorIdLinked(msg.sender, doctorId);
    }
    
    /**
     * @dev Verify a doctor (owner only)
     * @param doctorAddress Address of the doctor to verify
     */
    function verifyDoctor(address doctorAddress) external onlyOwner {
        require(identities[doctorAddress].exists, "Identity not found");
        require(identities[doctorAddress].role == Role.DOCTOR, "Not a doctor");
        require(!identities[doctorAddress].isVerified, "Already verified");
        
        identities[doctorAddress].isVerified = true;
        
        emit DoctorVerified(doctorAddress, block.timestamp);
    }
    
    /**
     * @dev Update profile CID
     * @param newProfileCid New IPFS CID for profile
     */
    function updateProfile(string calldata newProfileCid) external {
        require(identities[msg.sender].exists, "Identity not registered");
        
        identities[msg.sender].profileCid = newProfileCid;
        
        emit ProfileUpdated(msg.sender, newProfileCid);
    }
    
    /**
     * @dev Get identity by wallet address
     * @param wallet Wallet address to lookup
     */
    function getIdentity(address wallet) external view returns (
        bytes32 identityHash,
        Role role,
        string memory profileCid,
        bool isVerified,
        uint256 registeredAt
    ) {
        Identity memory identity = identities[wallet];
        require(identity.exists, "Identity not found");
        
        return (
            identity.identityHash,
            identity.role,
            identity.profileCid,
            identity.isVerified,
            identity.registeredAt
        );
    }
    
    /**
     * @dev Check if an address is a verified doctor
     * @param wallet Address to check
     */
    function isVerifiedDoctor(address wallet) external view returns (bool) {
        return identities[wallet].exists && 
               identities[wallet].role == Role.DOCTOR && 
               identities[wallet].isVerified;
    }
    
    /**
     * @dev Check if an address is a patient
     * @param wallet Address to check
     */
    function isPatient(address wallet) external view returns (bool) {
        return identities[wallet].exists && 
               identities[wallet].role == Role.PATIENT;
    }
    
    /**
     * @dev Get wallet address by health ID
     * @param healthId Health ID to lookup
     */
    function getPatientByHealthId(string calldata healthId) external view returns (address) {
        return healthIdToAddress[healthId];
    }
    
    /**
     * @dev Get wallet address by doctor ID
     * @param doctorId Doctor ID to lookup
     */
    function getDoctorByDoctorId(string calldata doctorId) external view returns (address) {
        return doctorIdToAddress[doctorId];
    }
}
