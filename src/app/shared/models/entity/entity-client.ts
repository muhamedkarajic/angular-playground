import * as signalR from "@microsoft/signalr";
import { ReplaySubject } from "rxjs";
import { IEntity } from "./i-entity";

export class EntityClient {
    entityReturned$ = new ReplaySubject<IEntity>(1);
    entityLocked$ = new ReplaySubject<void>(1);

    connection: signalR.HubConnection;

    constructor(connectionString: string = "https://localhost:5000/ws") {

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(connectionString)
            .build();
        
        this.connection.start().then(() => {
            console.log('%cConnection established.', 'color: lightgreen');
            this.connection.send("NewWindowLoaded", "test");
        });
        this.connection.on("NewWindowLoaded", data => {
            console.log(data);
        });

        this.connection.on("updateTotalViews", data => {
            console.log(data);
        });
    }

    requestEntityById(id: string): void {
    }
}
