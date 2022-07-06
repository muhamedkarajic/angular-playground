import { Component } from '@angular/core'

@Component({
  templateUrl: './my-tooltip.component.html',
  styleUrls: ['./my-tooltip.component.scss']
})
export class CalloutComponent {
    public content: String = '';
}