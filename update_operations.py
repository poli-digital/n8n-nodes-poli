#!/usr/bin/env python3
"""
Script para automatizar a atualização dos arquivos de operação com o padrão seguro
"""
import os
import re
import glob

def update_imports(content):
    """Adiciona o import do parameterUtils se não existir"""
    if 'parameterUtils' in content:
        return content
    
    # Procura por imports existentes de transport
    transport_import = re.search(r"import \{([^}]+)\} from '\./transport';", content)
    if transport_import:
        # Adiciona o novo import após o import do transport
        new_import = "import { getParameterSafe } from './utils/parameterUtils';"
        content = content.replace(
            transport_import.group(0),
            transport_import.group(0) + '\n' + new_import
        )
    
    return content

def update_get_node_parameter_calls(content):
    """Substitui chamadas this.getNodeParameter por getParameterSafe"""
    
    # Padrão para capturar this.getNodeParameter
    pattern = r"this\.getNodeParameter\(([^)]+)\)"
    
    def replace_call(match):
        params = match.group(1)
        # Remove espaços e quebras de linha desnecessárias
        params = re.sub(r'\s+', ' ', params.strip())
        
        # Divide os parâmetros
        param_parts = []
        bracket_count = 0
        current_param = ''
        
        for char in params + ',':
            if char == ',' and bracket_count == 0:
                if current_param.strip():
                    param_parts.append(current_param.strip())
                current_param = ''
            else:
                if char in '({[':
                    bracket_count += 1
                elif char in ')}]':
                    bracket_count -= 1
                if char != ',' or bracket_count > 0:
                    current_param += char
        
        if len(param_parts) >= 2:
            param_name = param_parts[0]
            item_index = param_parts[1]
            fallback = param_parts[2] if len(param_parts) > 2 else "''"
            
            # Determina se é obrigatório baseado em patterns comuns
            is_required = False
            if 'required: true' in content and param_name.strip("'\"") in ['accountId', 'contactId', 'name', 'phone']:
                is_required = True
            
            required_param = ', true' if is_required else ''
            
            return f"getParameterSafe(this, {param_name}, {item_index}, {fallback}{required_param})"
        
        return match.group(0)  # Retorna o original se não conseguir parsear
    
    return re.sub(pattern, replace_call, content)

def process_file(filepath):
    """Processa um único arquivo"""
    print(f"Processando: {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pula arquivos que já foram atualizados
        if 'parameterUtils' in content:
            print(f"  ✓ Já atualizado")
            return
        
        # Pula arquivos que não têm getNodeParameter
        if 'getNodeParameter' not in content:
            print(f"  ✓ Não tem getNodeParameter")
            return
        
        original_content = content
        
        # Atualiza imports
        content = update_imports(content)
        
        # Atualiza chamadas getNodeParameter
        content = update_get_node_parameter_calls(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Atualizado")
        else:
            print(f"  ✓ Nenhuma mudança necessária")
            
    except Exception as e:
        print(f"  ❌ Erro: {e}")

def main():
    # Procura todos os arquivos .operation.ts
    base_dir = '/workspaces/n8n-nodes-poli/nodes/Poli'
    pattern = os.path.join(base_dir, '*.operation.ts')
    files = glob.glob(pattern)
    
    # Arquivos já atualizados manualmente
    updated_files = [
        'CreateContact.operation.ts',
        'ListContacts.operation.ts', 
        'SendMessageByContactId.operation.ts',
        'SendMessageByPhoneNumber.operation.ts'
    ]
    
    # Filtra arquivos que ainda precisam ser atualizados
    files_to_update = [f for f in files if not any(updated in f for updated in updated_files)]
    
    print(f"Encontrados {len(files_to_update)} arquivos para atualizar:")
    for filepath in files_to_update:
        process_file(filepath)
    
    print("\n✅ Processamento concluído!")

if __name__ == '__main__':
    main()
