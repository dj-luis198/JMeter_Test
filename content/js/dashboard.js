/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.3918331885317, "KoPercent": 0.6081668114682884};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6434977578475336, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67b26e19-a34c-4c95-a51e-4a12ce4eb671"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/73154a4e-ea94-42cf-9773-046f3e230da4"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b5a48fd-004e-4276-ac38-d0d44cd76e51"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73baddf3-30a8-4b0d-bfe9-a474705bd2a0"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40a52559-1658-4b00-9509-816ffe3fe550"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6c13bfbf-3d50-424f-ba60-fc7fe49cb48c"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/004b1729-7e4e-448f-92d2-3fff63c5d99f"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9b684ad-658c-450e-82bd-696cb5796fdb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63ea8da6-0d09-44a0-a515-1d073f8dd808"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3e3ba1c5-5e34-40e5-a7cb-d46bac13d028"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f069d98-ddca-4d78-874f-13e2875ffe7d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef308653-bc75-48f9-b557-b29d506a2a85"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e77ed8e-18a2-48b8-b2d8-24752f651e91"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d83a17ac-acdc-4369-bc0d-339837f50dd1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/40a52559-1658-4b00-9509-816ffe3fe550"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37735849056603776, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/73baddf3-30a8-4b0d-bfe9-a474705bd2a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9b684ad-658c-450e-82bd-696cb5796fdb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=004b1729-7e4e-448f-92d2-3fff63c5d99f"], "isController": false}, {"data": [0.08163265306122448, 500, 1500, "addBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73154a4e-ea94-42cf-9773-046f3e230da4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b5a48fd-004e-4276-ac38-d0d44cd76e51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c13bfbf-3d50-424f-ba60-fc7fe49cb48c"], "isController": false}, {"data": [0.5188679245283019, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5960264900662252, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/db57e6fa-956c-4a7f-a555-349188b9018c"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef308653-bc75-48f9-b557-b29d506a2a85"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/5f069d98-ddca-4d78-874f-13e2875ffe7d"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/d83a17ac-acdc-4369-bc0d-339837f50dd1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/63ea8da6-0d09-44a0-a515-1d073f8dd808"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7ec845b-9e9a-4476-89f2-7c6b09e6fdd2"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/67b26e19-a34c-4c95-a51e-4a12ce4eb671"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1151, 7, 0.6081668114682884, 787.9748045178103, 98, 9708, 318.0, 1805.1999999999998, 3637.599999999984, 6535.68, 4.447965374657031, 640.9259089575203, 3.24443521273718], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67b26e19-a34c-4c95-a51e-4a12ce4eb671", 1, 0, 0.0, 6528.0, 6528, 6528, 6528.0, 6528.0, 6528.0, 6528.0, 0.15318627450980393, 0.027675254672181373, 0.10561475566789216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73154a4e-ea94-42cf-9773-046f3e230da4", 3, 0, 0.0, 4033.0, 726, 5764, 5609.0, 5764.0, 5764.0, 5764.0, 0.020241958881834193, 0.027905174435080664, 0.012980683267322057], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2841.716981132076, 1589, 5650, 2509.0, 4254.8, 5064.199999999999, 5650.0, 0.23961300239613, 288.33492363041955, 1.17817526080519], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b5a48fd-004e-4276-ac38-d0d44cd76e51", 1, 0, 0.0, 6506.0, 6506, 6506, 6506.0, 6506.0, 6506.0, 6506.0, 0.1537042729787888, 0.027768838379956962, 0.105971891331079], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 2991.153846153846, 1208, 5726, 2562.0, 5234.0, 5726.0, 5726.0, 0.10686307551931344, 0.02024554360424493, 0.07224014547763685], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 2991.153846153846, 1208, 5726, 2562.0, 5234.0, 5726.0, 5726.0, 0.10667454417146702, 0.020209825751234964, 0.07211269704019169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 146.0, 100, 331, 110.0, 323.0, 331.0, 331.0, 0.08947321329887736, 0.039751024336714014, 0.050143650559733896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 123.76470588235294, 104, 345, 109.0, 163.39999999999984, 345.0, 345.0, 0.08947227149045016, 0.06649257676194587, 0.044910886275479865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 232.7058823529412, 98, 891, 106.0, 696.5999999999998, 891.0, 891.0, 0.08947415512713225, 3.116381533587019, 0.051783784059389784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 265.11764705882354, 100, 1242, 111.0, 1226.8, 1242.0, 1242.0, 0.08947698073086903, 9.49322598398362, 0.05169803953303543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73baddf3-30a8-4b0d-bfe9-a474705bd2a0", 1, 0, 0.0, 3832.0, 3832, 3832, 3832.0, 3832.0, 3832.0, 3832.0, 0.2609603340292275, 0.047146154097077245, 0.17991991779749478], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 1539.6153846153843, 113, 5865, 1425.0, 5002.599999999999, 5865.0, 5865.0, 0.10959273653063116, 0.23904257045548427, 0.07084175915310105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40a52559-1658-4b00-9509-816ffe3fe550", 1, 0, 0.0, 1447.0, 1447, 1447, 1447.0, 1447.0, 1447.0, 1447.0, 0.691085003455425, 0.12485422425708362, 0.4764707152729786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 134.21052631578945, 101, 324, 113.0, 321.0, 324.0, 324.0, 0.10924500204115661, 0.08118695952472675, 0.05483587016518995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 142.68421052631578, 99, 346, 109.0, 331.0, 346.0, 346.0, 0.10924814278157272, 0.029232413205225512, 0.06230558143011569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 332.61674561651586, 0.645149886877828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 926.0, 926, 926, 926.0, 926.0, 926.0, 926.0, 1.0799136069114472, 971.7081617845572, 0.6148336258099352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 5.840037128712871, 1.8274288366336635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 140.625, 99, 344, 112.5, 344.0, 344.0, 344.0, 0.04952763022671272, 0.03680715488528163, 0.02486054876614291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 210.125, 106, 325, 203.0, 325.0, 325.0, 325.0, 0.0494679107846229, 0.02252384121418987, 0.02769285142312996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 313.125, 103, 869, 320.5, 869.0, 869.0, 869.0, 0.04946760490223964, 5.575546162937015, 0.02855015087619495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 280.75, 108, 847, 201.5, 847.0, 847.0, 847.0, 0.04953223000291002, 1.832196704094458, 0.028635820470432356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 6.351829594017094, 4.799345619658119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 788.1999999999999, 105, 1349, 956.0, 1332.8, 1349.0, 1349.0, 0.08042033025948961, 48.24879495161377, 0.042670943464507824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 148.21052631578948, 98, 450, 108.0, 328.0, 450.0, 450.0, 0.10925002731250683, 0.029446296424074102, 0.06422706683801671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 592.2666666666667, 102, 906, 775.0, 901.2, 906.0, 906.0, 0.08041688111168296, 15.77071371322268, 0.04274764546073512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 186.2105263157895, 99, 343, 114.0, 341.0, 343.0, 343.0, 0.10924814278157272, 0.02944578848409577, 0.06433264657938315], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 4504.538461538462, 396, 7107, 5261.0, 6992.6, 7107.0, 7107.0, 0.10521630043300555, 0.019933556917971752, 0.07196472471773703], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6c13bfbf-3d50-424f-ba60-fc7fe49cb48c", 3, 0, 0.0, 971.0, 187, 1969, 757.0, 1969.0, 1969.0, 1969.0, 0.01691322388598232, 0.02331624451729659, 0.01084604526542486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/004b1729-7e4e-448f-92d2-3fff63c5d99f", 3, 0, 0.0, 5336.666666666666, 203, 9708, 6099.0, 9708.0, 9708.0, 9708.0, 0.042455633862613563, 0.019707595666694968, 0.027225780829866122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 484.25, 224, 968, 434.5, 968.0, 968.0, 968.0, 0.049429399371010894, 7.458873436409077, 0.10958700578323972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9b684ad-658c-450e-82bd-696cb5796fdb", 1, 0, 0.0, 7107.0, 7107, 7107, 7107.0, 7107.0, 7107.0, 7107.0, 0.14070634585619812, 0.02542058006191079, 0.09701042985788659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63ea8da6-0d09-44a0-a515-1d073f8dd808", 1, 0, 0.0, 6459.0, 6459, 6459, 6459.0, 6459.0, 6459.0, 6459.0, 0.15482272797646693, 0.027970903003560924, 0.10674301362440007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 17, 0, 0.0, 1214.294117647059, 489, 2288, 1175.0, 2218.4, 2288.0, 2288.0, 0.08168874665436529, 0.050177950825777126, 0.03693543916110462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 121.66666666666667, 100, 299, 109.0, 189.20000000000005, 299.0, 299.0, 0.08051356922019925, 0.05983479118805823, 0.040414037674982826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 219.33333333333331, 99, 340, 298.0, 335.8, 340.0, 340.0, 0.08052005217699382, 0.10217030058135479, 0.04141330808582364], "isController": false}, {"data": ["login", 17, 0, 0.0, 8040.235294117647, 4950, 11314, 7473.0, 11080.4, 11314.0, 11314.0, 0.08058094118539304, 5.786177250519036, 0.12943961732348033], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3e3ba1c5-5e34-40e5-a7cb-d46bac13d028", 1, 0, 0.0, 1293.0, 1293, 1293, 1293.0, 1293.0, 1293.0, 1293.0, 0.7733952049497294, 0.24697288283062646, 0.46146920920340295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 251.3157894736842, 107, 951, 127.0, 779.0, 951.0, 951.0, 0.1060196861817289, 0.0858303904732942, 0.03768668532241145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f069d98-ddca-4d78-874f-13e2875ffe7d", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 785.0, 1.2738853503184713, 0.23014530254777069, 0.8782842356687898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef308653-bc75-48f9-b557-b29d506a2a85", 3, 0, 0.0, 4131.333333333333, 1574, 5534, 5286.0, 5534.0, 5534.0, 5534.0, 0.019434834998250865, 0.02297131701778935, 0.012463094058123113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e77ed8e-18a2-48b8-b2d8-24752f651e91", 1, 0, 0.0, 1802.0, 1802, 1802, 1802.0, 1802.0, 1802.0, 1802.0, 0.5549389567147613, 0.17721195199778023, 0.33112080327413984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d83a17ac-acdc-4369-bc0d-339837f50dd1", 1, 0, 0.0, 5261.0, 5261, 5261, 5261.0, 5261.0, 5261.0, 5261.0, 0.19007793195210038, 0.034340251378065005, 0.13104982417791294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40a52559-1658-4b00-9509-816ffe3fe550", 3, 0, 0.0, 1590.3333333333333, 745, 2381, 1645.0, 2381.0, 2381.0, 2381.0, 0.050945030312293034, 0.03275274572486287, 0.03266982738125562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 927.2666666666667, 218, 1453, 1069.0, 1445.2, 1453.0, 1453.0, 0.08036776288295239, 64.14004128726386, 0.16704041862228222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 416.8235294117647, 215, 1358, 224.0, 1340.4, 1358.0, 1358.0, 0.08942144326209425, 12.708062041715104, 0.19841923764274558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 2, 66.66666666666667, 420.0, 104, 1043, 113.0, 1043.0, 1043.0, 1043.0, 0.045854732208363905, 18.294246950660305, 0.05472117456896551], "isController": false}, {"data": ["register", 19, 1, 5.2631578947368425, 3423.0000000000005, 2080, 5278, 3213.0, 5167.0, 5278.0, 5278.0, 0.07750293695340034, 0.024984499412609322, 0.03496714538327242], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 677.6428571428571, 102, 1871, 488.0, 1753.5, 1871.0, 1871.0, 0.0720197951551255, 0.05591380580891091, 0.025600786559048516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 367.84210526315786, 214, 656, 426.0, 650.0, 656.0, 656.0, 0.10917532407833043, 0.1692004290159281, 0.24553786264882319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 323.9230769230769, 222, 453, 229.0, 449.4, 453.0, 453.0, 0.0649214450514877, 0.10061555986006931, 0.14600985151716425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 127.76923076923077, 104, 341, 108.0, 252.99999999999991, 341.0, 341.0, 0.06590220113351786, 0.04897614752207724, 0.03307981580334783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 126.92307692307692, 101, 339, 110.0, 248.99999999999991, 339.0, 339.0, 0.0658251178522783, 0.02521845710987225, 0.037115635111117866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 235.38461538461542, 105, 1513, 111.0, 1040.1999999999996, 1513.0, 1513.0, 0.06590119889488759, 4.5777818305958995, 0.03830705206194713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 194.0, 99, 809, 105.0, 620.1999999999998, 809.0, 809.0, 0.06582645109347862, 1.5052361302401653, 0.03832788629999646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.7447522095959596, 1.5610203598484849], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1263.6415094339623, 831, 2013, 1239.0, 1738.8000000000002, 1891.2999999999997, 2013.0, 0.23172944494239556, 277.22897834094834, 0.4575751344468006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 1, 5.2631578947368425, 3423.0000000000005, 2080, 5278, 3213.0, 5167.0, 5278.0, 5278.0, 0.07561797797526894, 0.02437684816308012, 0.03411670490681079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 109.33333333333333, 100, 115, 113.0, 115.0, 115.0, 115.0, 0.07529175555276696, 0.020293480988831724, 0.0443368443342954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 105.0, 99, 111, 105.0, 111.0, 111.0, 111.0, 0.07532200155665471, 0.020301633232067087, 0.0442810985713927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 191.5, 98, 1093, 107.0, 698.0, 1093.0, 1093.0, 0.07566463272927736, 4.88202080811179, 0.044018068984526586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 214.35714285714286, 100, 783, 111.0, 555.5, 783.0, 783.0, 0.07566667747619203, 1.6081174637340425, 0.044093151760331205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 125.64285714285715, 100, 312, 111.5, 218.5, 312.0, 312.0, 0.07566913131837245, 0.05623457903640766, 0.037982356931292434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73baddf3-30a8-4b0d-bfe9-a474705bd2a0", 2, 0, 0.0, 3082.0, 1425, 4739, 3082.0, 4739.0, 4739.0, 4739.0, 0.01081040176858173, 0.021377991778689456, 0.006719551489943624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 111.0, 108, 113, 112.0, 113.0, 113.0, 113.0, 0.075295534974776, 0.020147438069422482, 0.04294198479030193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 169.21428571428572, 98, 336, 108.0, 332.5, 336.0, 336.0, 0.07566708643883667, 0.02836460118040655, 0.04269996716588928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 110.0, 102, 114, 114.0, 114.0, 114.0, 114.0, 0.07529364521634374, 0.0559555312594117, 0.037793880508985044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 462.3333333333333, 115, 974, 298.0, 974.0, 974.0, 974.0, 0.0647179376550534, 0.05094009545895804, 0.02300520440081976], "isController": false}, {"data": ["deleteAccount", 10, 1, 10.0, 4400.200000000001, 104, 9708, 4662.5, 9462.300000000001, 9708.0, 9708.0, 0.08712622847982156, 0.016497827834216213, 0.05929518420662856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 17, 0, 0.0, 3801.3529411764707, 2387, 5370, 3851.0, 5259.599999999999, 5370.0, 5370.0, 0.08277944148223894, 0.04284482811092445, 0.03807530950989701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 224.33333333333334, 218, 228, 227.0, 228.0, 228.0, 228.0, 0.07507507507507508, 0.11635170326576576, 0.16884560341591592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9b684ad-658c-450e-82bd-696cb5796fdb", 3, 0, 0.0, 4981.666666666667, 1829, 7251, 5865.0, 7251.0, 7251.0, 7251.0, 0.01803545770985758, 0.01808829596486693, 0.011565706929824034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=004b1729-7e4e-448f-92d2-3fff63c5d99f", 1, 0, 0.0, 4037.0, 4037, 4037, 4037.0, 4037.0, 4037.0, 4037.0, 0.24770869457517958, 0.04475205907852366, 0.1707835335645281], "isController": false}, {"data": ["addBook", 49, 2, 4.081632653061225, 3930.8163265306125, 1027, 10905, 3278.0, 8057.0, 10272.5, 10905.0, 0.24047073373019184, 88.97798155337959, 0.8721808717186788], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73154a4e-ea94-42cf-9773-046f3e230da4", 1, 0, 0.0, 2836.0, 2836, 2836, 2836.0, 2836.0, 2836.0, 2836.0, 0.3526093088857546, 0.06370383021861778, 0.2431075899153738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b5a48fd-004e-4276-ac38-d0d44cd76e51", 3, 0, 0.0, 4677.0, 3709, 6137, 4185.0, 6137.0, 6137.0, 6137.0, 0.031066835117950418, 0.01997298156183336, 0.019922417051550234], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 204.54716981132083, 99, 455, 115.0, 429.2, 438.79999999999995, 455.0, 0.23267759226983578, 0.17291762472396977, 0.1124759845445007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c13bfbf-3d50-424f-ba60-fc7fe49cb48c", 1, 0, 0.0, 6821.0, 6821, 6821, 6821.0, 6821.0, 6821.0, 6821.0, 0.14660606949127694, 0.026486448101451402, 0.10107801275472805], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 705.6603773584905, 484, 1092, 655.0, 922.2, 1046.6, 1092.0, 0.23221272438102164, 68.27825115613457, 0.11678667290647085], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 152.94339622641513, 98, 343, 110.0, 321.0, 335.7, 343.0, 0.23283296211851637, 0.4120052024987809, 0.1132332179052941], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1050.9811320754718, 687, 1575, 1060.0, 1346.0, 1463.3999999999999, 1575.0, 0.2324612381850479, 209.16903074217635, 0.11668464494835412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 767.923076923077, 114, 2121, 512.0, 1966.9999999999998, 2121.0, 2121.0, 0.06168416757215861, 0.0460824103444349, 0.021926793941665756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 151, 2, 1.3245033112582782, 1185.6953642384103, 104, 7846, 632.0, 3038.4000000000015, 5196.400000000002, 7811.159999999999, 0.660666704585727, 1.4903882702126823, 0.3143533396483153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 453.61538461538464, 113, 2160, 124.0, 1911.9999999999998, 2160.0, 2160.0, 0.062218818799655407, 0.048183128230592516, 0.022116845745190006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db57e6fa-956c-4a7f-a555-349188b9018c", 1, 0, 0.0, 1205.0, 1205, 1205, 1205.0, 1205.0, 1205.0, 1205.0, 0.8298755186721991, 0.26500907676348545, 0.4951698651452282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 470.3529411764706, 112, 1073, 405.0, 1058.6, 1073.0, 1073.0, 0.08906119027661358, 0.07227524328111903, 0.03165846998113998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef308653-bc75-48f9-b557-b29d506a2a85", 1, 0, 0.0, 6544.0, 6544, 6544, 6544.0, 6544.0, 6544.0, 6544.0, 0.1528117359413203, 0.02760758901283619, 0.1053565288814181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f069d98-ddca-4d78-874f-13e2875ffe7d", 3, 0, 0.0, 1378.3333333333333, 634, 2254, 1247.0, 2254.0, 2254.0, 2254.0, 0.04540432551874442, 0.029190606412604243, 0.029116706143205245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 382.9230769230769, 216, 1627, 221.0, 1248.5999999999997, 1627.0, 1627.0, 0.065788807805589, 6.1484464352587525, 0.1466657488917116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 395.35714285714283, 210, 1209, 312.5, 929.0, 1209.0, 1209.0, 0.07562294400120997, 6.571067294629691, 0.16869571352948484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d83a17ac-acdc-4369-bc0d-339837f50dd1", 2, 0, 0.0, 2878.5, 1767, 3990, 2878.5, 3990.0, 3990.0, 3990.0, 0.06857769853243725, 0.041555138612673154, 0.04262666515224249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63ea8da6-0d09-44a0-a515-1d073f8dd808", 3, 0, 0.0, 2767.3333333333335, 1620, 3791, 2891.0, 3791.0, 3791.0, 3791.0, 0.02422950184144214, 0.024300486710118238, 0.015537799032435226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7ec845b-9e9a-4476-89f2-7c6b09e6fdd2", 1, 0, 0.0, 4229.0, 4229, 4229, 4229.0, 4229.0, 4229.0, 4229.0, 0.23646252069047055, 0.07551098072830456, 0.14109238295105225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 517.125, 105, 1125, 457.5, 1125.0, 1125.0, 1125.0, 0.0540084388185654, 0.04477848101265823, 0.01919831223628692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 419.4, 109, 2050, 126.0, 1486.6000000000004, 2050.0, 2050.0, 0.07776452900616933, 0.06037382867178185, 0.02764285992016175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67b26e19-a34c-4c95-a51e-4a12ce4eb671", 2, 0, 0.0, 2062.5, 1447, 2678, 2062.5, 2678.0, 2678.0, 2678.0, 0.01253549110920293, 0.021092432794098292, 0.007791836026374673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 111.15384615384615, 105, 115, 113.0, 115.0, 115.0, 115.0, 0.06495842660697153, 0.04827476821084506, 0.03260608523045251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 173.76923076923077, 101, 343, 111.0, 337.8, 343.0, 343.0, 0.06496069877723977, 0.01738206197750361, 0.037047898521394555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 175.15384615384613, 102, 328, 113.0, 326.8, 328.0, 328.0, 0.06495940037476577, 0.017508588382261086, 0.038189022485946286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 172.6153846153846, 101, 340, 107.0, 333.2, 340.0, 340.0, 0.06496134799794123, 0.017509113327570096, 0.038253606291756406], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 14.285714285714286, 0.08688097306689835], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 14.285714285714286, 0.08688097306689835], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 14.285714285714286, 0.08688097306689835], "isController": false}, {"data": ["401/Unauthorized", 4, 57.142857142857146, 0.3475238922675934], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1151, 7, "401/Unauthorized", 4, "406/Not Acceptable", 1, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 151, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
