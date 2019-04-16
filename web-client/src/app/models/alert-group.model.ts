export class AlertGroupViewModel {
    public id: number;
    public name: string;
    public members: Array<AlertGroupMemberViewModel>;
}

export class AlertGroupMemberViewModel {
    public id: number;
    public name: string;
    public notificationMethod: string;
    public address: string;
    public editingId: number;
}
