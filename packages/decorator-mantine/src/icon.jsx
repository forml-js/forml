import * as Icons from '@phosphor-icons/react';
import { useMemo } from 'react';

export default function Icon(props) {
    const { icon: iconName, ...rest } = props;
    const Component = useMemo(() => {
        let icon = iconName.replace(/^([a-z])/, (c) => c.toUpperCase());
        icon = icon.replace(/_([a-z])/g, (c) => c[1].toUpperCase());
        icon = `${icon}Icon`;
        const Icon = Icons[icon];
        return Icon;
    }, [iconName]);

    if (Component) {
        return <Component {...rest} />;
    } else {
        console.error('Icon not found: %o', iconName);
        return <Icons.XCircleIcon {...rest} />;
    }
}
