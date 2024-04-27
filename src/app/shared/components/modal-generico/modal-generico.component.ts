import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-generico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-generico.component.html',
  styleUrl: './modal-generico.component.css'
})
export class ModalGenericoComponent {

  @Input() color: string = "";
  @Input() backColor: string = "";
  @Input() icono: string = "";
  @Input() texto: string = "";
  @Input() titulo: string = "";

  constructor(public modalService: ModalService) {}

}
