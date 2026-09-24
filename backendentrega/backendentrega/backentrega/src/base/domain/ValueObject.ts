import shallowEqual from "shallowequal";

export abstract class ValueObject {
    public equals(vo?: ValueObject): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }

        const props = JSON.parse(JSON.stringify(this));
        const voProps = JSON.parse(JSON.stringify(vo));

        return shallowEqual(props, voProps);
    }
}
