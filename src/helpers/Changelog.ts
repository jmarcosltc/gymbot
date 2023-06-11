export default function changelog() {
    return "" +
        "- Comandos: !changelog e !roadmap adicionados\n" +
        "- Erro ao treinar mais de 5 vezes no total corrigido\n" +
        "- >Easter egg adicionado<\n" +
        "- CD/CI para aumentar a velocidade de desenvolvimento\n";
}

export function nextOnRoadMap() {
    return "Para o futuro:\n" +
        "- Adicionar comando !treinou para adicionar treinos para outras pessoas\n" +
        "- Comando !remover para remover treinos\n" +
        "- Comando !treinos [nome] para mostrar treinos de outras pessoas\n" +
        "- Comando !total [nome] para mostrar total de treinos de outras pessoas\n" +
        "Para o desenvolvimento:\n" +
        "- Adicionar testes unitários\n" +
        "- Dockerizar o projeto\n" +
        "- Documentar o projeto (preguiça)\n" +
        "- Deixar o bot open source\n";
}