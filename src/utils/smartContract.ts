import { contractAddress } from '@/config';
import json from '@/contracts/ping-pong.abi.json';
import { AbiRegistry, Address, SmartContract } from './sdkDappCore';
import { TypedValue } from '@multiversx/sdk-core/out';

/*
  *  Singleton class to manage the SmartContract instance.
  *
  *  This class is a Singleton because we only need one instance of the SmartContract,
  *  and we want to avoid creating multiple instances of it as hooks are called.
  */
class SmartContractService {
  static instance: SmartContractService | undefined;
  smartContract: SmartContract | undefined;

  constructor() {
    if (SmartContractService.instance) {
      return SmartContractService.instance;
    }

    try {
      const abi = AbiRegistry.create(json);
      this.smartContract = new SmartContract({
        address: new Address(contractAddress),
        abi
      });
    } catch (error) {
      console.error('Error initializing SmartContractService:', error);
    }

    SmartContractService.instance = this;
  }

  getSmartContract() {
    return this.smartContract;
  }

  executeMethod(methodName: string, args: TypedValue[]) {
    this.ensureSmartContractInitialized();

    try {
      return this.smartContract!.methodsExplicit[methodName](args);
    } catch (error) {
      console.error(`Error executing method ${methodName}:`, error);
      throw error;
    }
  }

  getContractAddress() {
    this.ensureSmartContractInitialized(); 

    return this.smartContract!.getAddress().toString();
  }

  private ensureSmartContractInitialized() {
    if (!this.smartContract) {
      throw new Error('SmartContract is not initialized.');
    }
  }
}

export const smartContractService = new SmartContractService();
