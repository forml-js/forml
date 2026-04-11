import * as Icons from '@phosphor-icons/react';
import { useMemo } from 'react';

export default function Icon(props) {
    const { icon: iconName, ...rest } = props;
    const fixedName = useMemo(() => {
        let icon = iconName.replace(/^([a-z])/, (c) => c.toUpperCase());
        icon = icon.replace(/_([a-z])/g, (c) => c[1].toUpperCase());
        icon = `${icon}Icon`;
        return icon;
    }, [iconName]);
    const Component = useMemo(() => {
        const Icon = Icons[fixedName];
        return Icon;
    }, [fixedName]);

    if (Component) {
        return <Component data-icon={fixedName} {...rest} />;
    } else {
        console.error('Icon not found: %o', iconName);
        return <Icons.XCircleIcon data-icon="XCircleIcon" {...rest} />;
    }
}
