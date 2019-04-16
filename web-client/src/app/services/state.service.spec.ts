import { TestBed, inject } from '@angular/core/testing';

import { StateService } from './state.service';
import { Injector } from '@angular/core';
import { Account, User, HostGroup, SalesforceAuth } from '../../../models';

describe('State Service', () => {
    let service: StateService;
    let fakeAccount: Account;
    let fakeHostGroup: HostGroup;
    let fakeSalesforceAuth: SalesforceAuth;
    let fakeUser: User;
    const fakeToken = 'SomeFakeTokenString';

    beforeEach(() => {
        service = new StateService();
        fakeAccount = new Account({
            name: 'Fake Account',
            accountId: 'fake account id',
            groupName: 'fake group',
            groupId: 'fake group id'
        });

        fakeHostGroup = new HostGroup({
            Id: 'fake host group id',
            Name: 'fake host group name',
            // origin: ZabbixHostGroupOrigin,
            usedInternally: false
        });

        fakeSalesforceAuth = new SalesforceAuth({
            UserId: 'wrgqwrg',
            ContactId: 'dfwfgwqagf',
            AccessToken: 'somefakeaccesstoken',
            InstanceUrl: 'http://fake.instance/url',
            IsSuperUser: false
        });

        fakeUser = new User({
            Account: fakeAccount,
            HostGroup: fakeHostGroup,
            Password: 'superSecret',
            SalesforceAuth: fakeSalesforceAuth,
            Username: 'Fake User',
            EmailAddress: 'fake@email.com',
            PasswordExpired: false
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get token from local storage', () => {
        localStorage.setItem('Token', fakeToken);

        const result = service.GetToken();

        expect(result).toBeTruthy();
        expect(result).toEqual(fakeToken);
    });

    it('should set service.User from local storage', () => {
        localStorage.setItem('User', JSON.stringify(fakeUser));

        const result = service.GetUser();

        expect(service.User).toBeTruthy();
        expect(service.User.Username).toEqual(fakeUser.Username);
        expect(service.User.EmailAddress).toEqual(fakeUser.EmailAddress);
        expect(service.User.Password).toEqual(fakeUser.Password);
    });

    it('should set user and token in local storage', () => {
        const fakeData = { User: fakeUser, Token: fakeToken };
        service.SetUser(fakeData);

        const userResult = localStorage.getItem('User');
        const tokenResult = localStorage.getItem('Token');

        expect(userResult).toEqual(JSON.stringify(fakeUser));
        expect(tokenResult).toEqual(fakeToken);
    });

    it('should set user in local storage from account', () => {
        service.SetAccount(fakeAccount);

        const userResult = localStorage.getItem('User');

        expect(userResult).toEqual(JSON.stringify(fakeUser));
    });

    it('should clear user from local storage', () => {
        localStorage.setItem('User', JSON.stringify(fakeUser));
        localStorage.setItem('Token', fakeToken);

        service.ClearUser();

        const userResult = localStorage.getItem('User');
        const tokenResult = localStorage.getItem('Token');
        expect(userResult).toBeNull();
        expect(tokenResult).toBeNull();
        expect(service.Token).toBeNull();
        expect(service.User.IsAuthenticated).toBeFalsy();
    });
});
