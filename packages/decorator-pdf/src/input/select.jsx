import { useDecorator } from '@forml/hooks';

export default function Select(props) {
    const deco = useDecorator();
    console.error('decorator : %o', deco);
    return (
        <deco.Input.Form
            value={props.value}
            form={props.form}
            schema={props.form.schema}
        />
    );
}
