import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { refresh_tokens } from "./apiInterceptors";
import { SOCKET_URL } from "./config";
// 🎯 MODIFICATION ICI : Importer mmkvStorage au lieu de tokenStorage
import { mmkvStorage } from "@/store/storage";

interface WSService {
    initializeSocket: () => void;
    emit: (event: string, data?: any) => void;
    on: (event: string, cb: (data: any) => void) => void;
    off: (event: string) => void;
    removeListener: (listenerName: string) => void;
    updateAccessToken: () => void;
    disconnect: () => void;
}

const WSContext = createContext<WSService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [socketAccessToken, setSocketAccessToken] = useState<string | null>(null);
    const socket = useRef<Socket | null>(null);

    // 🎯 MODIFICATION ICI : initializeSocket doit être asynchrone
    const initializeSocket = useCallback(async () => {
        // Utiliser await avec getItem pour récupérer le token
        const token = await mmkvStorage.getItem("access_token");
        setSocketAccessToken(token ?? null);
    }, []);

    useEffect(() => {
        initializeSocket(); // Appelle la fonction asynchrone au montage
    }, [initializeSocket]); // Ajout de initializeSocket aux dépendances

    useEffect(() => {
        if (socketAccessToken) {
            if (socket.current) {
                socket.current.disconnect();
            }

            socket.current = io(SOCKET_URL, {
                transports: ["websocket"],
                withCredentials: true,
                extraHeaders: {
                    access_token: socketAccessToken,
                },
            });

            socket.current.on("connect_error", async (error) => {
                if (error.message === "Authentication error") {
                    console.log("Erreur de connexion d'authentification Socket.io:", error.message);
                    await refresh_tokens(); // Tente de rafraîchir les tokens
                    initializeSocket(); // Relance l'initialisation pour utiliser le nouveau token
                } else {
                    console.error("Erreur de connexion Socket.io:", error.message);
                }
            });

            socket.current.on("connect", () => {
                console.log("Connecté au serveur WebSocket !");
            });

            socket.current.on("disconnect", (reason) => {
                console.log("Déconnecté du serveur WebSocket:", reason);
            });

        } else if (socket.current && socket.current.connected) {
            // Si socketAccessToken devient null mais le socket est connecté, déconnectez-le
            socket.current.disconnect();
            socket.current = null; // Réinitialise la référence
        }

        return () => {
            // Nettoyage : déconnecter le socket lors du démontage du composant
            socket.current?.disconnect();
            socket.current = null;
        };
    }, [socketAccessToken, initializeSocket]); // Ajout de initializeSocket aux dépendances

    const emit = useCallback((event: string, data: any = {}) => {
        if (socket.current && socket.current.connected) {
            socket.current.emit(event, data);
        } else {
            console.warn(`Tentative d'émettre "${event}" alors que le socket n'est pas connecté.`);
        }
    }, []);

    const on = useCallback((event: string, cb: (data: any) => void) => {
        socket.current?.on(event, cb);
    }, []);

    const off = useCallback((event: string) => {
        socket.current?.off(event);
    }, []);

    const removeListener = useCallback((listenerName: string) => {
        socket.current?.removeListener(listenerName);
    }, []);

    const disconnect = useCallback(() => {
        socket.current?.disconnect();
        socket.current = null;
        setSocketAccessToken(null); // Réinitialise le token dans l'état
    }, []);

    // 🎯 MODIFICATION ICI : updateAccessToken doit être asynchrone
    const updateAccessToken = useCallback(async () => {
        const token = await mmkvStorage.getItem("access_token");
        setSocketAccessToken(token ?? null);
    }, []);

    const socketService: WSService = {
        initializeSocket,
        emit,
        off,
        on,
        disconnect,
        removeListener,
        updateAccessToken,
    };

    return (
        <WSContext.Provider value={socketService}>
            {children}
        </WSContext.Provider>
    );
};

export const useWS = (): WSService => {
    const socketService = useContext(WSContext);
    if (!socketService) {
        throw new Error("useWS must be used within a WSProvider");
    }
    return socketService;
};