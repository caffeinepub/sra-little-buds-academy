import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitInquiry(data.name, data.phone, data.message);
    },
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerUser(data.name, data.email, data.password);
    },
  });
}

export function useLoginUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.loginUser(data.email, data.password);
    },
  });
}

export function useIsEmailRegistered() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.isEmailRegistered(email);
    },
  });
}

export function useForgotPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: { email: string; newPassword: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.forgotPassword(data.email, data.newPassword);
    },
  });
}
