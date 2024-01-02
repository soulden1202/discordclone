import { Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "editServer" | "members";

interface IModalData {
  server?: Server;
}

interface IModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: IModalData;
  onOpen: (type: ModalType, data?: IModalData) => void;
  onClose: () => void;
}

export const useModal = create<IModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type: type, data: data }),
  onClose: () => set({ isOpen: false, type: null }),
}));