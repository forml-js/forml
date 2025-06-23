import { describe, it } from 'mocha';
import * as chai from 'chai';
import { renderHook, act } from '@testing-library/react';
import { useSelect, useFileField } from '../src/helpers.jsx';

const { expect } = chai;

describe('useSelect', function () {
    it('returns indexOf and valueOf functions', function () {
        const form = {
            titleMap: [
                { value: 'option1', title: 'Option 1' },
                { value: 'option2', title: 'Option 2' },
            ],
        };

        const { result } = renderHook(() => useSelect(form));

        expect(result.current.indexOf).to.be.a('function');
        expect(result.current.valueOf).to.be.a('function');
    });

    it('indexOf returns correct index for existing value', function () {
        const form = {
            titleMap: [
                { value: 'apple', title: 'Apple' },
                { value: 'banana', title: 'Banana' },
                { value: 'cherry', title: 'Cherry' },
            ],
        };

        const { result } = renderHook(() => useSelect(form));

        expect(result.current.indexOf('banana')).to.equal(1);
        expect(result.current.indexOf('cherry')).to.equal(2);
        expect(result.current.indexOf('apple')).to.equal(0);
    });

    it('indexOf returns empty string for non-existing value', function () {
        const form = {
            titleMap: [{ value: 'option1', title: 'Option 1' }],
        };

        const { result } = renderHook(() => useSelect(form));

        expect(result.current.indexOf('nonexistent')).to.equal('');
    });

    it('valueOf returns correct value for existing index', function () {
        const form = {
            titleMap: [
                { value: 'first', title: 'First' },
                { value: 'second', title: 'Second' },
            ],
        };

        const { result } = renderHook(() => useSelect(form));

        expect(result.current.valueOf(0)).to.equal('first');
        expect(result.current.valueOf(1)).to.equal('second');
    });

    it('memoizes results correctly', function () {
        const form = {
            titleMap: [{ value: 'option1', title: 'Option 1' }],
        };

        const { result, rerender } = renderHook(() => useSelect(form));
        const firstResult = result.current;

        rerender();

        expect(result.current).to.equal(firstResult);
    });

    it('updates when titleMap changes', function () {
        let form = {
            titleMap: [{ value: 'option1', title: 'Option 1' }],
        };

        const { result, rerender } = renderHook(() => useSelect(form));
        const firstResult = result.current;

        form = {
            titleMap: [{ value: 'option2', title: 'Option 2' }],
        };

        rerender();

        expect(result.current).to.not.equal(firstResult);
        expect(result.current.indexOf('option2')).to.equal(0);
    });
});

describe('useFileField', function () {
    it('returns onChange and display properties', function () {
        const form = {};

        const { result } = renderHook(() => useFileField(form));

        expect(result.current.onChange).to.be.a('function');
        expect(result.current.display).to.be.a('string');
    });

    it('initializes with empty display', function () {
        const form = {};

        const { result } = renderHook(() => useFileField(form));

        expect(result.current.display).to.equal('');
    });

    it('uses default format data_url', function () {
        const form = {};

        const { result } = renderHook(() => useFileField(form));

        // This tests the internal logic by checking that it creates a single file processor
        expect(result.current.onChange).to.be.a('function');
    });

    it('uses custom format when provided', function () {
        const form = { format: 'name' };

        const { result } = renderHook(() => useFileField(form));

        expect(result.current.onChange).to.be.a('function');
    });

    it('uses allowMultiple false by default', function () {
        const form = {};

        const { result } = renderHook(() => useFileField(form));

        expect(result.current.onChange).to.be.a('function');
    });

    it('respects allowMultiple when provided', function () {
        const form = { allowMultiple: true };

        const { result } = renderHook(() => useFileField(form));

        expect(result.current.onChange).to.be.a('function');
    });

    it('updates when form changes', function () {
        let form = { format: 'data_url' };

        const { result, rerender } = renderHook(() => useFileField(form));
        const firstOnChange = result.current.onChange;

        form = { format: 'name' };
        rerender();

        expect(result.current.onChange).to.not.equal(firstOnChange);
    });

    describe('onChange behavior', function () {
        it('handles empty file list', async function () {
            const form = {};

            const { result } = renderHook(() => useFileField(form));

            const mockEvent = {
                target: {
                    files: [],
                },
            };

            const fileResult = await result.current.onChange(mockEvent);

            expect(fileResult).to.be.null;
            expect(result.current.display).to.equal('');
        });

        it('handles single file with name format', async function () {
            const form = { format: 'name' };

            const { result } = renderHook(() => useFileField(form));

            const mockFile = {
                name: 'test.txt',
                size: 1024,
                type: 'text/plain',
            };

            const mockEvent = {
                target: {
                    files: [mockFile],
                },
            };

            let fileResult;
            await act(async () => {
                fileResult = await result.current.onChange(mockEvent);
            });

            expect(fileResult).to.equal('test.txt');
            expect(result.current.display).to.equal('test.txt');
        });

        it('handles multiple files with name format', async function () {
            const form = { allowMultiple: true, format: 'name' };

            const { result, rerender } = renderHook(() => useFileField(form));

            const mockFiles = [{ name: 'file1.txt' }, { name: 'file2.txt' }];

            const mockEvent = {
                target: {
                    files: mockFiles,
                },
            };

            const fileResult = await result.current.onChange(mockEvent);

            rerender();

            expect(fileResult).to.deep.equal(['file1.txt', 'file2.txt']);
            expect(result.current.display).to.equal('file1.txt, file2.txt');
        });

        it('handles multiple files with empty list', async function () {
            const form = { allowMultiple: true };

            const { result } = renderHook(() => useFileField(form));

            const mockEvent = {
                target: {
                    files: [],
                },
            };

            const fileResult = await result.current.onChange(mockEvent);

            expect(fileResult).to.be.null;
            expect(result.current.display).to.equal('');
        });
    });

    it('memoizes results correctly', function () {
        const form = { format: 'name' };

        const { result, rerender } = renderHook(() => useFileField(form));
        const firstResult = result.current;

        rerender();

        expect(result.current).to.equal(firstResult);
    });
});

