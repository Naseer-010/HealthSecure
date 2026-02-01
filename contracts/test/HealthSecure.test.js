const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HealthSecure Contracts", function () {
    let identityContract;
    let recordRegistry;
    let accessControl;
    let owner, patient, doctor, otherUser;

    // Sample data
    const patientHealthId = "HID-TEST-0001";
    const doctorId = "DOC-TEST-0001";
    const patientIdentityHash = ethers.keccak256(ethers.toUtf8Bytes("patient@example.com:2024-01-01"));
    const doctorIdentityHash = ethers.keccak256(ethers.toUtf8Bytes("doctor@example.com:2024-01-01"));
    const sampleProfileCid = "QmTestProfileCid123456789";
    const sampleRecordCid = "QmTestRecordCid987654321";
    const sampleRecordHash = ethers.keccak256(ethers.toUtf8Bytes("record-content-hash"));

    beforeEach(async function () {
        [owner, patient, doctor, otherUser] = await ethers.getSigners();

        // Deploy HealthSecureIdentity
        const HealthSecureIdentity = await ethers.getContractFactory("HealthSecureIdentity");
        identityContract = await HealthSecureIdentity.deploy();
        await identityContract.waitForDeployment();

        // Deploy MedicalRecordRegistry
        const MedicalRecordRegistry = await ethers.getContractFactory("MedicalRecordRegistry");
        recordRegistry = await MedicalRecordRegistry.deploy(await identityContract.getAddress());
        await recordRegistry.waitForDeployment();

        // Deploy AccessControl
        const AccessControl = await ethers.getContractFactory("AccessControl");
        accessControl = await AccessControl.deploy(await identityContract.getAddress());
        await accessControl.waitForDeployment();
    });

    describe("HealthSecureIdentity", function () {
        it("Should register a patient", async function () {
            await identityContract.connect(patient).registerPatient(
                patientIdentityHash,
                patientHealthId,
                sampleProfileCid
            );

            const identity = await identityContract.getIdentity(patient.address);
            expect(identity.identityHash).to.equal(patientIdentityHash);
            expect(identity.role).to.equal(1); // PATIENT = 1
            expect(identity.isVerified).to.be.true;
        });

        it("Should register a doctor", async function () {
            await identityContract.connect(doctor).registerDoctor(
                doctorIdentityHash,
                doctorId,
                sampleProfileCid
            );

            const identity = await identityContract.getIdentity(doctor.address);
            expect(identity.role).to.equal(2); // DOCTOR = 2
            expect(identity.isVerified).to.be.false; // Doctors start unverified
        });

        it("Should verify a doctor (owner only)", async function () {
            await identityContract.connect(doctor).registerDoctor(
                doctorIdentityHash,
                doctorId,
                sampleProfileCid
            );

            await identityContract.connect(owner).verifyDoctor(doctor.address);

            expect(await identityContract.isVerifiedDoctor(doctor.address)).to.be.true;
        });

        it("Should prevent duplicate registrations", async function () {
            await identityContract.connect(patient).registerPatient(
                patientIdentityHash,
                patientHealthId,
                sampleProfileCid
            );

            await expect(
                identityContract.connect(patient).registerPatient(
                    patientIdentityHash,
                    "HID-TEST-0002",
                    sampleProfileCid
                )
            ).to.be.revertedWith("Identity already registered");
        });

        it("Should lookup patient by health ID", async function () {
            await identityContract.connect(patient).registerPatient(
                patientIdentityHash,
                patientHealthId,
                sampleProfileCid
            );

            const patientAddress = await identityContract.getPatientByHealthId(patientHealthId);
            expect(patientAddress).to.equal(patient.address);
        });
    });

    describe("MedicalRecordRegistry", function () {
        beforeEach(async function () {
            // Register and verify doctor
            await identityContract.connect(doctor).registerDoctor(
                doctorIdentityHash,
                doctorId,
                sampleProfileCid
            );
            await identityContract.connect(owner).verifyDoctor(doctor.address);

            // Register patient
            await identityContract.connect(patient).registerPatient(
                patientIdentityHash,
                patientHealthId,
                sampleProfileCid
            );
        });

        it("Should create a medical record (verified doctor)", async function () {
            await recordRegistry.connect(doctor).createRecord(
                patient.address,
                sampleRecordHash,
                sampleRecordCid,
                2 // DIAGNOSIS
            );

            expect(await recordRegistry.recordCount()).to.equal(1);
        });

        it("Should prevent unverified doctors from creating records", async function () {
            // Register another doctor but don't verify
            const unverifiedHash = ethers.keccak256(ethers.toUtf8Bytes("unverified@example.com"));
            await identityContract.connect(otherUser).registerDoctor(
                unverifiedHash,
                "DOC-TEST-0002",
                sampleProfileCid
            );

            await expect(
                recordRegistry.connect(otherUser).createRecord(
                    patient.address,
                    sampleRecordHash,
                    sampleRecordCid,
                    2
                )
            ).to.be.revertedWith("Only verified doctors can create records");
        });

        it("Should allow patient to toggle visibility", async function () {
            await recordRegistry.connect(doctor).createRecord(
                patient.address,
                sampleRecordHash,
                sampleRecordCid,
                2
            );

            await recordRegistry.connect(patient).toggleVisibility(0);

            const record = await recordRegistry.records(0);
            expect(record.isVisible).to.be.false;
        });

        it("Should verify record hash correctly", async function () {
            await recordRegistry.connect(doctor).createRecord(
                patient.address,
                sampleRecordHash,
                sampleRecordCid,
                2
            );

            expect(await recordRegistry.verifyRecord(0, sampleRecordHash)).to.be.true;
            expect(await recordRegistry.verifyRecord(0, ethers.ZeroHash)).to.be.false;
        });
    });

    describe("AccessControl", function () {
        beforeEach(async function () {
            // Register and verify doctor
            await identityContract.connect(doctor).registerDoctor(
                doctorIdentityHash,
                doctorId,
                sampleProfileCid
            );
            await identityContract.connect(owner).verifyDoctor(doctor.address);

            // Register patient
            await identityContract.connect(patient).registerPatient(
                patientIdentityHash,
                patientHealthId,
                sampleProfileCid
            );
        });

        it("Should grant access to a doctor", async function () {
            await accessControl.connect(patient).grantAccess(doctor.address, 0);

            expect(await accessControl.hasAccess(patient.address, doctor.address)).to.be.true;
        });

        it("Should grant time-limited access", async function () {
            // Grant 1 hour access
            await accessControl.connect(patient).grantAccess(doctor.address, 3600);

            expect(await accessControl.hasAccess(patient.address, doctor.address)).to.be.true;
        });

        it("Should revoke access", async function () {
            await accessControl.connect(patient).grantAccess(doctor.address, 0);
            await accessControl.connect(patient).revokeAccess(doctor.address);

            expect(await accessControl.hasAccess(patient.address, doctor.address)).to.be.false;
        });

        it("Should track patient-doctor relationships", async function () {
            await accessControl.connect(patient).grantAccess(doctor.address, 0);

            const doctorPatients = await accessControl.getDoctorPatients(doctor.address);
            expect(doctorPatients.length).to.equal(1);
            expect(doctorPatients[0]).to.equal(patient.address);
        });
    });
});
