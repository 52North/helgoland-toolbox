// @ts-nocheck
import {
  Address,
  Contact,
  LegalConstraints,
  OnlineFunction,
  OnlineResource,
  Phone,
  ResponsibleParty,
  Restriction,
  Role,
} from '../../model/iso';
import { BidiMap } from '../dynamicGUI/BidiMap';
import { DecoderUtils } from './DecoderUtils';
import { NAMESPACES } from './Namespaces';
import { ReturnObject } from './ReturnObject';

export class IsoDecoder {
  private utils = new DecoderUtils();

  private _profileIDMap: BidiMap;

  public get profileIDMap() {
    return this._profileIDMap;
  }
  public set profileIDMap(profileIDMap: BidiMap) {
    this._profileIDMap = profileIDMap;
  }
  public decodeContact(elem: Element): Contact {
    const contactElem = this.utils.getElement(
      elem,
      'CI_Contact',
      NAMESPACES.GMD,
    );
    if (contactElem != null) {
      const contact = new Contact();
      this._profileIDMap = this.utils.processProfileID(
        contactElem,
        contact,
        '',
        this._profileIDMap,
      );

      const phoneElem = this.utils.getElement(
        contactElem,
        'phone',
        NAMESPACES.GMD,
      );
      if (phoneElem != null) {
        contact.phone = this.decodePhone(phoneElem);
        this._profileIDMap = this.utils.processProfileID(
          phoneElem,
          contact,
          'phone',
          this._profileIDMap,
        );
      }
      const addressElem = this.utils.getElement(
        contactElem,
        'address',
        NAMESPACES.GMD,
      );
      if (addressElem != null) {
        contact.address = this.decodeAddress(addressElem);
        this._profileIDMap = this.utils.processProfileID(
          addressElem,
          contact,
          'address',
          this._profileIDMap,
        );
      }
      const onlineResourceElem = this.utils.getElement(
        contactElem,
        'onlineResource',
        NAMESPACES.GMD,
      );
      if (onlineResourceElem != null) {
        const returnObject: ReturnObject<OnlineResource> =
          this.decodeOnlineResource(onlineResourceElem);
        if (returnObject) {
          contact.onlineResource = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            contact,
            'onlineResource',
            this._profileIDMap,
          );
        }
      }
      const hoursOfServiceElem = this.utils.getElement(
        contactElem,
        'hoursOfService',
        NAMESPACES.GMD,
      );
      if (hoursOfServiceElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(hoursOfServiceElem);
        if (returnObject) {
          contact.hoursOfService = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            contact,
            'hoursOfService',
            this._profileIDMap,
          );
        }
      }
      const contactInstructionsElem = this.utils.getElement(
        contactElem,
        'contactInstructions',
        NAMESPACES.GMD,
      );
      if (contactInstructionsElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(contactInstructionsElem);
        if (returnObject) {
          contact.contactInstructions = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            contact,
            'contactInstructions',
            this._profileIDMap,
          );
        }
      }
      return contact;
    }
    return undefined;
  }

  public decodePhone(elem: Element): Phone {
    const phoneElem = this.utils.getElement(
      elem,
      'CI_Telephone',
      NAMESPACES.GMD,
    );
    if (phoneElem != null) {
      const phone = new Phone();
      this._profileIDMap = this.utils.processProfileID(
        phoneElem,
        phone,
        '',
        this._profileIDMap,
      );

      phone.voice = this.utils.getDecodedList(
        phoneElem,
        'voice',
        NAMESPACES.GMD,
        this._profileIDMap,
        (voice) => this.getDecodedCharacterString(voice),
      );

      phone.facsimile = this.utils.getDecodedList(
        phoneElem,
        'facsimile',
        NAMESPACES.GMD,
        this._profileIDMap,
        (facsimile) => this.getDecodedCharacterString(facsimile),
      );

      return phone;
    }
    return undefined;
  }

  public decodeOnlineResource(elem: Element): ReturnObject<OnlineResource> {
    const onlineResourceElem = this.utils.getElement(
      elem,
      'CI_OnlineResource',
      NAMESPACES.GMD,
    );
    if (onlineResourceElem != null) {
      const onlineResource = new OnlineResource();
      this._profileIDMap = this.utils.processProfileID(
        onlineResourceElem,
        onlineResource,
        '',
        this._profileIDMap,
      );

      const linkageElem = this.utils.getElement(
        onlineResourceElem,
        'linkage',
        NAMESPACES.GMD,
      );
      if (linkageElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedUrl(linkageElem);
        if (returnObject) {
          onlineResource.linkage = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            onlineResource,
            'linkage',
            this._profileIDMap,
          );
        }
      }

      const protocolElem = this.utils.getElement(
        onlineResourceElem,
        'protocol',
        NAMESPACES.GMD,
      );
      if (protocolElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(protocolElem);
        if (returnObject) {
          onlineResource.protocol = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            onlineResource,
            'protocol',
            this._profileIDMap,
          );
        }
      }

      const applicationProfileElem = this.utils.getElement(
        onlineResourceElem,
        'applicationProfile',
        NAMESPACES.GMD,
      );
      if (applicationProfileElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(applicationProfileElem);
        if (returnObject) {
          onlineResource.applicationProfile = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            onlineResource,
            'applicationProfile',
            this._profileIDMap,
          );
        }
      }
      const nameElem = this.utils.getElement(
        onlineResourceElem,
        'name',
        NAMESPACES.GMD,
      );
      if (nameElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(nameElem);
        if (returnObject) {
          onlineResource.name = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            onlineResource,
            'name',
            this._profileIDMap,
          );
        }
      }

      const descriptionElem = this.utils.getElement(
        onlineResourceElem,
        'description',
        NAMESPACES.GMD,
      );
      if (descriptionElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(descriptionElem);
        if (returnObject) {
          onlineResource.description = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            onlineResource,
            'description',
            this._profileIDMap,
          );
        }
      }
      const functionElem = this.utils.getElement(
        onlineResourceElem,
        'function',
        NAMESPACES.GMD,
      );
      if (functionElem != null) {
        onlineResource.function = this.decodeOnlineFunction(functionElem);
        this._profileIDMap = this.utils.processProfileID(
          functionElem,
          onlineResource,
          'function',
          this._profileIDMap,
        );
      }
      return new ReturnObject(onlineResource, onlineResourceElem);
    }
    return undefined;
  }

  public decodeAddress(elem: Element): Address {
    const addressElem = this.utils.getElement(
      elem,
      'CI_Address',
      NAMESPACES.GMD,
    );
    if (addressElem != null) {
      const address = new Address();
      this._profileIDMap = this.utils.processProfileID(
        addressElem,
        address,
        '',
        this._profileIDMap,
      );

      const cityElem = this.utils.getElement(
        addressElem,
        'city',
        NAMESPACES.GMD,
      );
      if (cityElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(cityElem);
        if (returnObject) {
          address.city = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            address,
            'city',
            this._profileIDMap,
          );
        }
      }

      const administrativeAreaElem = this.utils.getElement(
        addressElem,
        'administrativeArea',
        NAMESPACES.GMD,
      );
      if (administrativeAreaElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(administrativeAreaElem);
        if (returnObject) {
          address.administrativeArea = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            address,
            'administrativeArea',
            this._profileIDMap,
          );
        }
      }

      const postalCodeElem = this.utils.getElement(
        addressElem,
        'postalCode',
        NAMESPACES.GMD,
      );
      if (postalCodeElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(postalCodeElem);
        if (returnObject) {
          address.postalCode = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            address,
            'postalCode',
            this._profileIDMap,
          );
        }
      }

      const countryElem = this.utils.getElement(
        addressElem,
        'country',
        NAMESPACES.GMD,
      );
      if (countryElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(countryElem);
        if (returnObject) {
          address.country = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            address,
            'country',
            this._profileIDMap,
          );
        }
      }

      address.deliveryPoint = this.utils.getDecodedList(
        addressElem,
        'deliveryPoint',
        NAMESPACES.GMD,
        this._profileIDMap,
        (deliveryPoint) => this.getDecodedCharacterString(deliveryPoint),
      );

      address.electronicMailAddress = this.utils.getDecodedList(
        addressElem,
        'electronicMailAddress',
        NAMESPACES.GMD,
        this._profileIDMap,
        (electronicMailAddress) =>
          this.getDecodedCharacterString(electronicMailAddress),
      );

      return address;
    }
    return undefined;
  }

  public decodeResponsibleParty(elem: Element): ReturnObject<ResponsibleParty> {
    const respPartyElem = this.utils.getElement(
      elem,
      'CI_ResponsibleParty',
      NAMESPACES.GMD,
    );

    if (respPartyElem != null) {
      const respParty = new ResponsibleParty();
      this._profileIDMap = this.utils.processProfileID(
        respPartyElem,
        respParty,
        '',
        this._profileIDMap,
      );

      const individualNameElem = this.utils.getElement(
        respPartyElem,
        'individualName',
        NAMESPACES.GMD,
      );
      if (individualNameElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(individualNameElem);
        if (returnObject) {
          respParty.individualName = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            respParty,
            'individualName',
            this._profileIDMap,
          );
        }
      }

      const organisationNameElem = this.utils.getElement(
        respPartyElem,
        'organisationName',
        NAMESPACES.GMD,
      );
      if (organisationNameElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(organisationNameElem);
        if (returnObject) {
          respParty.organisationName = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            respParty,
            'organisationName',
            this._profileIDMap,
          );
        }
      }

      const positionNameElem = this.utils.getElement(
        respPartyElem,
        'positionName',
        NAMESPACES.GMD,
      );
      if (positionNameElem != null) {
        const returnObject: ReturnObject<string> =
          this.getDecodedCharacterString(positionNameElem);
        if (returnObject) {
          respParty.positionName = returnObject.value;
          this._profileIDMap = this.utils.processProfileID(
            returnObject.docElement,
            respParty,
            'positionName',
            this._profileIDMap,
          );
        }
      }

      const contactInfoElem = this.utils.getElement(
        respPartyElem,
        'contactInfo',
        NAMESPACES.GMD,
      );
      if (contactInfoElem != null) {
        respParty.contactInfo = this.decodeContact(contactInfoElem);
        this._profileIDMap = this.utils.processProfileID(
          contactInfoElem,
          respParty,
          'contactInfo',
          this._profileIDMap,
        );
      }

      const roleElem = this.utils.getElement(
        respPartyElem,
        'role',
        NAMESPACES.GMD,
      );
      if (roleElem != null) {
        respParty.role = this.decodeRole(roleElem);
        this._profileIDMap = this.utils.processProfileID(
          roleElem,
          respParty,
          'role',
          this._profileIDMap,
        );
      }

      return new ReturnObject(respParty, respPartyElem);
    }
    return undefined;
  }

  public decodeRole(elem: Element): Role {
    const roleElem = this.utils.getElement(elem, 'CI_RoleCode', NAMESPACES.GMD);

    if (roleElem != null) {
      const role = roleElem.getAttribute('codeListValue');
      if (role.indexOf('resourceProvider') >= 0) {
        return 'resourceProvider';
      }
      if (role.indexOf('custodian') >= 0) {
        return 'custodian';
      }
      if (role.indexOf('user') >= 0) {
        return 'user';
      }
      if (role.indexOf('originator') >= 0) {
        return 'originator';
      }
      if (role.indexOf('pointOfContact') >= 0) {
        return 'pointOfContact';
      }
      if (role.indexOf('principalInvestigator') >= 0) {
        return 'principalInvestigator';
      }
      if (role.indexOf('processor') >= 0) {
        return 'processor';
      }
      if (role.indexOf('publisher') >= 0) {
        return 'publisher';
      }
      if (role.indexOf('author') >= 0) {
        return 'author';
      }
      if (role.indexOf('owner') >= 0) {
        return 'owner';
      }
    }
    return undefined;
  }

  public decodeOnlineFunction(elem: Element): OnlineFunction {
    const onlineFunctionElem = this.utils.getElement(
      elem,
      'CI_OnLineFunctionCode',
      NAMESPACES.GMD,
    );

    if (onlineFunctionElem != null) {
      const onlineFunction = onlineFunctionElem.getAttribute('codeListValue');
      if (onlineFunction.indexOf('download') >= 0) {
        return 'download';
      }
      if (onlineFunction.indexOf('information') >= 0) {
        return 'information';
      }
      if (onlineFunction.indexOf('offlineAccess') >= 0) {
        return 'offlineAccess';
      }
      if (onlineFunction.indexOf('order') >= 0) {
        return 'order';
      }
      if (onlineFunction.indexOf('search') >= 0) {
        return 'search';
      }
    }
    return undefined;
  }

  public decodeRestriction(elem: Element): ReturnObject<Restriction> {
    const restrictionElem = this.utils.getElement(
      elem,
      'MD_RestrictionCode',
      NAMESPACES.GMD,
    );

    if (restrictionElem != null) {
      const restriction = restrictionElem.getAttribute('codeListValue');
      if (restriction.indexOf('copyright') >= 0) {
        return new ReturnObject<Restriction>('copyright', restrictionElem);
      }
      if (restriction.indexOf('patent') >= 0) {
        return new ReturnObject<Restriction>('patent', restrictionElem);
      }
      if (restriction.indexOf('patentPending') >= 0) {
        return new ReturnObject<Restriction>('patentPending', restrictionElem);
      }
      if (restriction.indexOf('trademark') >= 0) {
        return new ReturnObject<Restriction>('trademark', restrictionElem);
      }
      if (restriction.indexOf('license') >= 0) {
        return new ReturnObject<Restriction>('license', restrictionElem);
      }
      if (restriction.indexOf('intellectualPropertyRights') >= 0) {
        return new ReturnObject<Restriction>(
          'intellectualPropertyRights',
          restrictionElem,
        );
      }
      if (restriction.indexOf('restricted') >= 0) {
        return new ReturnObject<Restriction>('restricted', restrictionElem);
      }
      if (restriction.indexOf('otherRestrictions') >= 0) {
        return new ReturnObject<Restriction>(
          'otherRestrictions',
          restrictionElem,
        );
      }
    }
    return undefined;
  }

  public decodeLegalConstraints(elem: Element): ReturnObject<LegalConstraints> {
    const legalConstraintsElem = this.utils.getElement(
      elem,
      'MD_LegalConstraints',
      NAMESPACES.GMD,
    );

    if (legalConstraintsElem != null) {
      const legalConstraints = new LegalConstraints();
      this._profileIDMap = this.utils.processProfileID(
        legalConstraintsElem,
        legalConstraints,
        '',
        this._profileIDMap,
      );

      legalConstraints.accessConstraints = this.utils.getDecodedList(
        legalConstraintsElem,
        'accessConstraints',
        NAMESPACES.GMD,
        this._profileIDMap,
        (accConst) => this.decodeRestriction(accConst),
      );

      legalConstraints.useConstraints = this.utils.getDecodedList(
        legalConstraintsElem,
        'useConstraints',
        NAMESPACES.GMD,
        this._profileIDMap,
        (useConst) => this.decodeRestriction(useConst),
      );

      legalConstraints.otherConstraints = this.utils.getDecodedList(
        legalConstraintsElem,
        'otherConstraints',
        NAMESPACES.GMD,
        this._profileIDMap,
        (otherConst) => this.getDecodedCharacterString(otherConst),
      );

      return new ReturnObject(legalConstraints, legalConstraintsElem);
    }
    return undefined;
  }

  private getDecodedCharacterString(elem: Element): ReturnObject<string> {
    const charStringElem = this.utils.getElement(
      elem,
      'CharacterString',
      NAMESPACES.GCO,
    );

    if (charStringElem != null) {
      return new ReturnObject(charStringElem.textContent, charStringElem);
    }
    return undefined;
  }

  private getDecodedUrl(elem: Element): ReturnObject<string> {
    const urlElem = this.utils.getElement(elem, 'URL', NAMESPACES.GMD);

    if (urlElem != null) {
      return new ReturnObject(urlElem.textContent, urlElem);
    }
    return undefined;
  }
}
