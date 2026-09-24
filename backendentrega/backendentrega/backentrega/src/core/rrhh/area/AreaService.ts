import { BaseService } from "../../../base/domain/BaseService";
import { AreaEntity, AreaProps } from "./AreaEntity";
import { Result } from "../../../base/types/Result";

export class AreaService extends BaseService<AreaEntity, AreaProps> {
    public async factory(props: AreaProps, id?: string): Promise<Result<AreaEntity>> {
        return AreaEntity.create(props, id);
    }

    public async eliminaArea(id: string): Promise<Result<boolean>> {
        return super.delete(id);
    }

    public async getParentIds(fidArea: string): Promise<Result<string[]>> {
        const areas = await this.getAll();
        if (areas.isFailure) return Result.fail<string[]>(`Error while getting areas: ${areas.error}`);
        
        const areasResult = areas.getValue();
    
        const getParentIdsRecursive = (currentFidArea: string | null, parentIds: string[] = []): string[] => {
            if (!currentFidArea) return parentIds;
    
            const currentArea = areasResult.find((a) => a.id === currentFidArea && a.props.activo);
            if (!currentArea) return parentIds;
    
            parentIds.push(currentArea.id);
    
            return getParentIdsRecursive(currentArea.props.areaId, parentIds);
        };
    
        try {
            const parentIds = getParentIdsRecursive(fidArea);
            return Result.ok<string[]>(parentIds);
        } catch (error) {
            return Result.fail<string[]>(`Error while getting parent IDs: ${error}`);
        }
    }

    public async getIndicePorSigla(codigo: string, areaResult: AreaEntity[]): Promise<Result<string>> {
        const niveles = codigo.split('.');
        const nombres: string[] = [];
      
        for (let i = 1; i <= niveles.length; i++) {
          const subCodigo = niveles.slice(0, i).join('.');
          const area = areaResult.find((a: AreaEntity) => a.props.indice === subCodigo);
          if (area) {
            nombres.push(area.props.sigla.toUpperCase());
          }
        }
      
        return Result.ok<string>(nombres.join('/'));
    }
}
