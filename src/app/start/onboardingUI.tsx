import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Activity, AvailableTrainingDay, DayOfWeek } from '../context';

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const countWords = (text: string) => (text.trim() === '' ? 0 : text.trim().split(/\s+/).length);

export const dayOfWeekOptions: { value: DayOfWeek; short: string; full: string }[] = [
    { value: 'monday', short: 'Mon', full: 'Monday' },
    { value: 'tuesday', short: 'Tue', full: 'Tuesday' },
    { value: 'wednesday', short: 'Wed', full: 'Wednesday' },
    { value: 'thursday', short: 'Thu', full: 'Thursday' },
    { value: 'friday', short: 'Fri', full: 'Friday' },
    { value: 'saturday', short: 'Sat', full: 'Saturday' },
    { value: 'sunday', short: 'Sun', full: 'Sunday' },
];

/**
 * FIELD SHELL — the shadow-inner input wrapper used across the site (matches StartPage inputs)
 */
export const FieldShell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn('flex items-center gap-2 rounded-[18px] border border-primary-100 bg-white px-4 py-3 shadow-primary-100/70 shadow-inner!', className)}>{children}</span>
);

/**
 * PILL CHOICE — reused as-is from OnboardingSteps.tsx
 */
export const PillChoice = ({ className, selected, onClick, children }: { className?: string; selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
        type='button'
        onClick={onClick}
        className={cn(
            'rounded-2xl border px-4 py-3 text-sm font-extrabold transition-all hover:-translate-y-0.5 cursor-pointer',
            selected
                ? 'bg-gradient-to-br from-secondary-100/50 via-secondary-100/50 to-secondary-100/50 border-secondary-100 shadow-secondary-200/70 shadow-inner!'
                : 'border-primary-100 bg-white text-gray-700 shadow-primary-100/70 shadow-inner!',
            className,
        )}
    >
        {children}
    </button>
);

/**
 * RADIO CARD — reused as-is from OnboardingSteps.tsx
 */
export const RadioCard = ({ selected, title, description, onClick }: { selected: boolean; title: string; description: string; onClick: () => void }) => (
    <button
        type='button'
        onClick={onClick}
        className={cn(
            'flex w-full items-start cursor-pointer gap-3 rounded-[18px] border px-4 py-3 text-left shadow-inner! transition-all hover:-translate-y-0.5',
            selected ? 'border-primary-300 bg-primary-50 shadow-primary-100/80' : 'border-primary-100 bg-white shadow-primary-100/70',
        )}
    >
        <span className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2', selected ? 'border-primary-500' : 'border-gray-300')}>
            <span className={cn('size-2.5 rounded-full bg-primary-500 transition-opacity', selected ? 'opacity-100' : 'opacity-0')} />
        </span>
        <span>
            <span className='block font-extrabold text-gray-900'>{title}</span>
            <span className='mt-1 block text-sm font-semibold leading-5 text-gray-500'>{description}</span>
        </span>
    </button>
);

/**
 * CHECK CARD — a compact single-line variant of RadioCard for boolean-ish "just starting" options
 */
export const CheckCard = ({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) => (
    <button
        type='button'
        onClick={onClick}
        className={cn(
            'flex w-full items-center cursor-pointer gap-3 rounded-[18px] border px-4 py-3.5 text-left shadow-inner! transition-all hover:-translate-y-0.5',
            selected ? 'border-secondary-300 bg-secondary-50 shadow-secondary-100/80' : 'border-primary-100 bg-white shadow-primary-100/70',
        )}
    >
        <span
            className={cn(
                'grid size-5 shrink-0 place-items-center rounded-md border-2 transition-colors',
                selected ? 'border-secondary-500 bg-secondary-500' : 'border-gray-300 bg-white',
            )}
        >
            {selected && <Check className='size-3.5 text-white' strokeWidth={3} />}
        </span>
        <span className='font-extrabold text-gray-900'>{label}</span>
    </button>
);

/**
 * TOGGLE SWITCH — for booleans like "power meter" / "gym access"
 */
export const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
    className,
}: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
    className?: string;
}) => (
    <button
        type='button'
        onClick={() => onChange(!checked)}
        className={cn(
            'flex w-full cursor-pointer items-center justify-between gap-3 rounded-[18px] border px-4 py-3.5 text-left shadow-inner! transition-all hover:-translate-y-0.5',
            checked ? 'border-secondary-300 bg-secondary-50 shadow-secondary-100/80' : 'border-primary-100 bg-white shadow-primary-100/70',
            className,
        )}
    >
        <span>
            <span className='block font-extrabold text-gray-900'>{label}</span>
            {description && <span className='mt-0.5 block text-sm font-semibold leading-5 text-gray-500'>{description}</span>}
        </span>
        <span className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', checked ? 'bg-gradient-to-r from-primary-400 to-secondary-500' : 'bg-gray-200')}>
            <motion.span
                layout
                className='absolute top-1 size-5 rounded-full bg-white shadow-md'
                animate={{ left: checked ? '1.5rem' : '0.25rem' }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
            />
        </span>
    </button>
);

/**
 * UNIT TOGGLE — small pill switch, e.g. lbs / kg
 */
export const UnitToggle = <T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) => (
    <div className='inline-flex rounded-full border border-primary-100 bg-white shadow-inner shadow-primary-100/70'>
        {options.map((opt) => (
            <button
                key={opt.value}
                type='button'
                onClick={() => onChange(opt.value)}
                className={cn(
                    'cursor-pointer rounded-full px-3 py-1 text-xs font-extrabold transition-all',
                    value === opt.value ? 'bg-gradient-to-r from-primary-400 to-secondary-500 text-white shadow-sm' : 'text-gray-500',
                )}
            >
                {opt.label}
            </button>
        ))}
    </div>
);

/**
 * WORD LIMITED TEXTAREA — free response with a live word counter, caps additional input past the limit
 */
export const WordLimitedTextarea = ({
    value,
    onChange,
    maxWords,
    placeholder,
    rows = 4,
}: {
    value: string;
    onChange: (value: string) => void;
    maxWords: number;
    placeholder?: string;
    rows?: number;
}) => {
    const words = countWords(value);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const next = event.target.value;
        if (countWords(next) <= maxWords || next.length < value.length) onChange(next);
    };

    return (
        <div>
            <textarea
                value={value}
                onChange={handleChange}
                rows={rows}
                placeholder={placeholder}
                className='w-full resize-none rounded-[18px] border border-primary-100 bg-white px-4 py-3 text-base font-semibold outline-none shadow-inner shadow-primary-100/70 placeholder:text-gray-400'
            />
            <div className='mt-1.5 flex justify-end'>
                <span className={cn('text-xs font-bold', words >= maxWords ? 'text-tertiary-600' : 'text-gray-400')}>
                    {words}/{maxWords} words
                </span>
            </div>
        </div>
    );
};

/**
 * RANGE SLIDER — reused as-is from OnboardingSteps.tsx (dual-thumb min/max slider)
 */
export const RangeSlider = ({
    label,
    min,
    max,
    valueMin,
    valueMax,
    unit,
    onMinChange,
    onMaxChange,
}: {
    label: string;
    min: number;
    max: number;
    valueMin: number;
    valueMax: number;
    unit: string;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
}) => {
    const minPercent = ((valueMin - min) / (max - min)) * 100;
    const maxPercent = ((valueMax - min) / (max - min)) * 100;

    return (
        <>
            <div className='flex items-center justify-between gap-3 mb-1'>
                <span className='text-sm font-extrabold text-gray-700'>{label}</span>
                <span className='rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 px-3 py-1 text-sm font-extrabold text-secondary-800'>
                    {valueMin !== valueMax ? `${valueMin}-${valueMax}` : valueMax}{' '}
                    {valueMin === valueMax && valueMax === 1 && unit.substring(unit.length - 1) === 's' ? unit.substring(0, unit.length - 1) : unit}
                </span>
            </div>
            <div className='rounded-[22px] border border-primary-100 bg-white px-4 py-4 shadow-inner shadow-primary-100/70'>
                <div className='relative h-9'>
                    <div className='absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary-100' />
                    <div
                        className='absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary-300 to-secondary-300'
                        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
                    />
                    <input
                        type='range'
                        min={min}
                        max={max}
                        value={valueMin}
                        onChange={(event) => {
                            let num = Number(event.target.value);
                            if (num > valueMax) num = valueMax;
                            onMinChange(num);
                        }}
                        className='range-thumb-left pointer-events-none absolute inset-x-0 top-1/2 z-20 h-4 w-full -translate-y-1/2 appearance-none bg-transparent'
                    />
                    <input
                        type='range'
                        min={min}
                        max={max}
                        value={valueMax}
                        onChange={(event) => {
                            let num = Number(event.target.value);
                            if (num < valueMin) num = valueMin;
                            onMaxChange(num);
                        }}
                        className='range-thumb-right pointer-events-none absolute inset-x-0 top-1/2 z-30 h-4 w-full -translate-y-1/2 appearance-none bg-transparent'
                    />
                </div>
                <div className='mt-1 flex justify-between text-xs font-bold text-gray-400'>
                    <span>{min}</span>
                    <span>{max}</span>
                    {/* <input
                        type='text'
                        value={adjustableMin}
                        onChange={(event) => {
                            if (!/^\d*$/.test(event.target.value)) return;
                            let num = Number(event.target.value);
                            if (num > valueMin) num = valueMin;
                            setAdjustableMin(num);
                        }}
                        className='text-base border-0 outline-0 focus:border-0 focus:outline-0 w-[30px]'
                    />
                    <input
                        type='text'
                        value={adjustableMax}
                        onChange={(event) => {
                            if (!/^\d*$/.test(event.target.value)) return;
                            let num = Number(event.target.value);
                            if (num < valueMax) num = valueMax;
                            setAdjustableMax(num);
                        }}
                        className='text-base border-0 outline-0 focus:border-0 focus:outline-0 w-[30px]'
                    /> */}
                </div>
            </div>
        </>
    );
};

/**
 * SINGLE SLIDER — one-thumb variant of RangeSlider, e.g. session length or single-value mileage
 */
export const SingleSlider = ({
    label,
    min,
    max,
    step = 1,
    value,
    unit,
    onChange,
}: {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    unit: string;
    onChange: (value: number) => void;
}) => {
    const percent = ((value - min) / (max - min)) * 100;

    return (
        <div className='rounded-[22px] border border-primary-100 bg-white px-4 py-4 shadow-inner shadow-primary-100/70'>
            <div className='mb-5 flex items-center justify-between gap-3'>
                <span className='text-sm font-extrabold text-gray-700'>{label}</span>
                <span className='rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 px-3 py-1 text-sm font-extrabold text-secondary-800'>
                    {value} {unit}
                </span>
            </div>
            <div className='relative h-9'>
                <div className='absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary-100' />
                <div className='absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-500' style={{ left: 0, right: `${100 - percent}%` }} />
                <input
                    type='range'
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(event) => onChange(Number(event.target.value))}
                    className='range-thumb pointer-events-none absolute inset-x-0 top-1/2 z-20 h-2 w-full -translate-y-1/2 appearance-none bg-transparent'
                />
            </div>
            <div className='mt-1 flex justify-between text-xs font-bold text-gray-400'>
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

/**
 * LEVEL BAR — a track with N clickable stops, used for experience levels
 */
export const LevelBar = <T extends string>({
    levels,
    selected,
    onSelect,
    smallSelectorClassName,
    smallSelectorChoiceClassName,
}: {
    levels: { value: T; label: string }[];
    selected: T | null;
    onSelect: (value: T) => void;
    smallSelectorClassName?: string;
    smallSelectorChoiceClassName?: (i: number) => string;
}) => {
    const selectedIndex = selected ? levels.findIndex((l) => l.value === selected) : -1;
    const fillPercent = selectedIndex >= 0 ? (selectedIndex / (levels.length - 1)) * 100 : 0;

    return (
        <div className='@container/level-bar-container'>
            <div className='hidden @min-[400px]/level-bar-container:block rounded-[22px] border border-primary-100 bg-white px-4 py-5 shadow-inner shadow-primary-100/70'>
                <div className='relative h-2 rounded-full bg-primary-100'>
                    <div className='absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-300 to-secondary-300 transition-all' style={{ width: `${fillPercent}%` }} />
                    <div className='absolute inset-0 flex items-center justify-between'>
                        {levels.map((level, index) => (
                            <button
                                key={level.value}
                                type='button'
                                onClick={() => onSelect(level.value)}
                                className={cn(
                                    'grid size-6 cursor-pointer place-items-center rounded-full border-2 bg-white transition-all hover:scale-110',
                                    index <= selectedIndex ? 'border-secondary-400' : 'border-primary-200',
                                )}
                            >
                                <span className={cn('size-2.5 rounded-full transition-all', index <= selectedIndex ? 'bg-secondary-400' : 'bg-transparent')} />
                            </button>
                        ))}
                    </div>
                </div>
                <div className='mt-3 flex justify-between gap-1'>
                    {levels.map((level) => (
                        <span
                            key={level.value}
                            className={cn('flex-1 truncate text-center text-[11px] font-extrabold capitalize', level.value === selected ? 'text-secondary-700' : 'text-gray-400')}
                        >
                            {level.label}
                        </span>
                    ))}
                </div>
            </div>
            <div className={cn('@min-[400px]/level-bar-container:hidden grid gap-2', smallSelectorClassName)}>
                {levels.map((level, i) => (
                    <PillChoice
                        key={level.value}
                        selected={level.value === selected}
                        onClick={() => onSelect(level.value)}
                        className={cn('flex-1 truncate text-center text-[12px] font-extrabold capitalize', smallSelectorChoiceClassName ? smallSelectorChoiceClassName(i) : '')}
                    >
                        {level.label}
                    </PillChoice>
                ))}
            </div>
        </div>
    );
};

/**
 * DAY AVAILABILITY PICKER — 7-day toggle grid with optional per-day minutes, reused across
 * running / cycling / strength / sports availability pages
 */
export const DayAvailabilityPicker = ({
    activity,
    establishingMinutes,
    hasOpened,
    days,
    onChange,
    defaultMinutes = 30,
}: {
    activity: Activity;
    establishingMinutes: boolean;
    hasOpened: boolean;
    days: AvailableTrainingDay[];
    onChange: (days: AvailableTrainingDay[]) => void;
    defaultMinutes?: number;
}) => {
    const toggleDay = (day: DayOfWeek) => {
        const exists = days.some((d) => d.dayOfWeek === day);
        if (exists) onChange(days.filter((d) => d.dayOfWeek !== day));
        else onChange([...days, { dayOfWeek: day, activity, trainingMinutes: defaultMinutes }]);
    };

    const setMinutes = (day: DayOfWeek, minutes: number | null) => {
        onChange(days.map((d) => (d.dayOfWeek === day ? { ...d, trainingMinutes: minutes } : d)));
    };

    const selectedDays = dayOfWeekOptions.filter(({ value }) => days.some((d) => d.dayOfWeek === value));

    return (
        <div className='@container/day-picker'>
            <div className='grid grid-cols-4 gap-2 @min-[430px]/day-picker:grid-cols-7'>
                {dayOfWeekOptions.map(({ value, short }) => {
                    const selected = days.some((d) => d.dayOfWeek === value);
                    return (
                        <div
                            key={value}
                            className={cn(
                                'cursor-pointer relative rounded-2xl border text-sm font-extrabold shadow-inner! grid place-items-center transition-all',
                                !establishingMinutes && 'hover:-translate-y-0.5',
                                selected
                                    ? 'bg-gradient-to-br from-secondary-100/50 via-secondary-100/50 to-secondary-100/50 border-secondary-100 shadow-secondary-200/70 shadow-inner!'
                                    : 'border-primary-100 bg-white text-gray-700 shadow-primary-100/70 shadow-inner!',
                            )}
                        >
                            <AnimatePresence mode='popLayout'>
                                {(!establishingMinutes || !selected) && (
                                    <motion.button
                                        type='button'
                                        variants={{
                                            visible: { y: 0, opacity: 1, transition: { duration: hasOpened ? 0.5 : 0 } },
                                            hidden: { y: -12, opacity: 0, transition: { duration: 0.3 } },
                                        }}
                                        animate={establishingMinutes && selected ? 'hidden' : 'visible'}
                                        initial='hidden'
                                        exit='hidden'
                                        onClick={() => toggleDay(value)}
                                        className='w-full h-full px-2 py-3 cursor-pointer'
                                    >
                                        {short}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                            <AnimatePresence mode='popLayout'>
                                {establishingMinutes && selected && (
                                    <motion.input
                                        variants={{
                                            visible: { y: 0, opacity: 1, transition: { duration: hasOpened ? 0.5 : 0 } },
                                            hidden: { y: 12, opacity: 0, transition: { duration: hasOpened ? 0.2 : 0 } },
                                        }}
                                        animate={establishingMinutes && selected ? 'visible' : 'hidden'}
                                        initial='hidden'
                                        exit='hidden'
                                        inputMode='numeric'
                                        type='number'
                                        min={0}
                                        max={180}
                                        value={days.find((d) => d.dayOfWeek === value)?.trainingMinutes || ''}
                                        placeholder='0'
                                        onChange={(e) => setMinutes(value, e.target.value === '' ? null : Math.max(0, Number(e.target.value)))}
                                        className='w-full h-full px-2 py-3 grid text-center rounded-2xl outline-none no-number-buttons'
                                    />
                                )}
                            </AnimatePresence>
                            <motion.div
                                variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
                                initial='hidden'
                                animate={establishingMinutes && selected ? 'visible' : 'hidden'}
                                transition={{ duration: 0.3 }}
                                className='absolute -top-2 -right-2 text-xs bg-secondary-50 rounded-[8px] py-px px-2'
                            >
                                mins
                            </motion.div>
                        </div>
                    );
                })}
            </div>
            {/* <AnimatePresence initial={false}>
                {selectedDays.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className='overflow-hidden'>
                        <div className='mt-3 space-y-2'>
                            {selectedDays.map(({ value, full }) => {
                                const day = days.find((d) => d.dayOfWeek === value)!;
                                return (
                                    <div
                                        key={value}
                                        className='flex items-center justify-between gap-3 rounded-[16px] border border-primary-100 bg-white px-4 py-2.5 shadow-inner shadow-primary-100/70'
                                    >
                                        <span className='text-sm font-extrabold text-gray-700'>{full}</span>
                                        <span className='flex items-center gap-1.5'>
                                            <input
                                                type='number'
                                                min={0}
                                                step={5}
                                                value={day.trainingMinutes}
                                                onChange={(event) => setMinutes(value, Math.max(0, Number(event.target.value)))}
                                                className='w-14 bg-transparent text-right text-sm font-bold outline-none'
                                            />
                                            <span className='text-xs font-bold text-gray-400'>min</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence> */}
        </div>
    );
};

/**
 * DATE PICKER CALENDAR — custom month-grid calendar, touch-friendly for mobile
 */
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const DatePickerCalendar = ({ selected, onSelect, minDate }: { selected: Date | null; onSelect: (date: Date) => void; minDate?: Date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const min = minDate ? new Date(minDate) : today;
    min.setHours(0, 0, 0, 0);

    const [viewDate, setViewDate] = useState(() => selected ?? min);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    const changeMonth = (delta: number) => setViewDate(new Date(year, month + delta, 1));

    return (
        <div className='rounded-[22px] border border-primary-100 bg-white p-4 shadow-inner shadow-primary-100/70'>
            <div className='flex items-center justify-between'>
                <button
                    type='button'
                    onClick={() => changeMonth(-1)}
                    className={cn(
                        'grid size-9 cursor-pointer place-items-center rounded-full bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-50/80 transition-all',
                        month === today.getMonth() && year === today.getFullYear() ? 'opacity-30 pointer-events-none' : '',
                    )}
                >
                    <ChevronLeft className='size-5' />
                </button>
                <span className='text-base font-extrabold text-gray-900'>
                    {MONTH_NAMES[month]} {year}
                </span>
                <button
                    type='button'
                    onClick={() => changeMonth(1)}
                    className='grid size-9 cursor-pointer place-items-center rounded-full bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-50/80 transition-all'
                >
                    <ChevronRight className='size-5' />
                </button>
            </div>
            <div className='mt-3 grid grid-cols-7 gap-y-1 text-center'>
                {WEEKDAY_LABELS.map((label, index) => (
                    <span key={index} className='text-[11px] font-extrabold text-gray-400'>
                        {label}
                    </span>
                ))}
                {cells.map((day, index) => {
                    if (day === null) return <span key={`empty-${index}`} />;

                    const cellDate = new Date(year, month, day);
                    cellDate.setHours(0, 0, 0, 0);
                    const isPast = cellDate.getTime() < today.getTime();
                    const disabled = cellDate < min || isPast;
                    const isSelected = !!selected && cellDate.getTime() === new Date(selected.getFullYear(), selected.getMonth(), selected.getDate()).getTime();
                    const isToday = cellDate.getTime() === today.getTime();

                    return (
                        <button type='button' disabled={disabled} onClick={() => onSelect(cellDate)} key={day} className='grid place-items-center py-0.5'>
                            <span
                                className={cn(
                                    'grid size-9 place-items-center rounded-full text-sm font-bold transition-all',
                                    isSelected
                                        ? 'bg-gradient-to-br from-primary-400 to-secondary-500 text-white shadow-md'
                                        : isToday
                                          ? 'text-secondary-600 ring-1 ring-secondary-300'
                                          : 'text-gray-700',
                                    disabled ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer',
                                    !disabled && !isSelected && 'hover:bg-primary-50',
                                )}
                            >
                                {day}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
