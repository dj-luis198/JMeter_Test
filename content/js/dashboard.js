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

    var data = {"OkPercent": 98.20732657833203, "KoPercent": 1.7926734216679656};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7620805369127517, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6fe83ad-6c06-404a-9959-f0742f095f08"], "isController": false}, {"data": [0.008928571428571428, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45b11d63-bad1-425b-8aa4-cc95d6c0d44c"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ac4f750-3242-46be-b365-4c46739e7e64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46a5a0e2-75b5-4730-a9f6-afa10e48c98f"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=785f05d7-02cd-49bb-bfec-5dd72c9d05c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64d44c79-d482-4051-9940-dcb02240ceba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5759baf-a662-4776-908d-30842201af10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3ba46e1-e61e-4c71-8ce4-f489aa52c17c"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c66e41cb-6563-4df7-8f82-dea6ea5d56cb"], "isController": false}, {"data": [0.38235294117647056, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45b11d63-bad1-425b-8aa4-cc95d6c0d44c"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1110354-2bc6-41ad-a781-9ff317cd75fe"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ac4f750-3242-46be-b365-4c46739e7e64"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5bb46e33-075a-4b3d-bdae-6bcefb28f034"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46a5a0e2-75b5-4730-a9f6-afa10e48c98f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a5759baf-a662-4776-908d-30842201af10"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/42470778-f073-447a-95bd-07ba76382341"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c333906f-73be-4be3-ada2-bcec9a1a1d5a"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6fe83ad-6c06-404a-9959-f0742f095f08"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eff3c748-3e86-4d6d-bc54-dd1a08af3405"], "isController": false}, {"data": [0.44642857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9215116279069767, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eff3c748-3e86-4d6d-bc54-dd1a08af3405"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c333906f-73be-4be3-ada2-bcec9a1a1d5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/785f05d7-02cd-49bb-bfec-5dd72c9d05c5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42470778-f073-447a-95bd-07ba76382341"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3ba46e1-e61e-4c71-8ce4-f489aa52c17c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1a4b76e-3f26-42e2-9cc3-696497081354"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1110354-2bc6-41ad-a781-9ff317cd75fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 23, 1.7926734216679656, 425.6375681995325, 117, 4097, 142.0, 1156.2000000000044, 1436.3999999999999, 1866.4800000000002, 4.960620483534838, 697.0551843655394, 3.6280638984368054], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6fe83ad-6c06-404a-9959-f0742f095f08", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2013.1964285714287, 1466, 2785, 1999.0, 2407.2000000000003, 2675.2999999999997, 2785.0, 0.2526539948657099, 304.02801068534654, 1.2422977188953608], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/45b11d63-bad1-425b-8aa4-cc95d6c0d44c", 3, 0, 0.0, 327.0, 216, 520, 245.0, 520.0, 520.0, 520.0, 0.02466253432202693, 0.024734787840548497, 0.01581549238749774], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 545.3076923076923, 130, 950, 494.0, 908.4, 950.0, 950.0, 0.07330014152565788, 0.014531180400106003, 0.04928157051191691], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 545.3076923076923, 130, 950, 494.0, 908.4, 950.0, 950.0, 0.07159891389955222, 0.014193925314071388, 0.048137791421348594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ac4f750-3242-46be-b365-4c46739e7e64", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 151.66666666666669, 119, 377, 124.5, 372.5, 377.0, 377.0, 0.09556727139512289, 0.033546020286808004, 0.05405731182538798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 126.38888888888889, 120, 132, 127.0, 131.1, 132.0, 132.0, 0.09556321241047586, 0.07101914516051964, 0.04796825310447714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 199.7777777777778, 118, 974, 125.5, 436.70000000000084, 974.0, 974.0, 0.09556676400318556, 1.5854273128484206, 0.055819866604725245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 220.3888888888889, 121, 1365, 125.5, 466.80000000000143, 1365.0, 1365.0, 0.09556930101675118, 4.801740365088003, 0.055728019060766146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46a5a0e2-75b5-4730-a9f6-afa10e48c98f", 3, 0, 0.0, 611.3333333333334, 248, 1119, 467.0, 1119.0, 1119.0, 1119.0, 0.025767440262484325, 0.025842930810128322, 0.016524042095408243], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 306.92857142857144, 123, 1244, 222.5, 826.5, 1244.0, 1244.0, 0.07110208227526664, 0.13639637030218385, 0.045956465845606906], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 125.83333333333334, 119, 135, 126.5, 129.60000000000002, 135.0, 135.0, 0.08422431743209415, 0.06259248590412465, 0.04227665933603163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 206.55555555555551, 119, 382, 126.0, 382.0, 382.0, 382.0, 0.08422549973796511, 0.029564831993523995, 0.047641876099610694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 795.75, 698, 989, 748.0, 989.0, 989.0, 989.0, 0.0341883263959521, 10.052503119684784, 0.019498029897691435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1284.0, 1097, 1373, 1333.0, 1373.0, 1373.0, 1373.0, 0.03400695442217934, 30.599517366926534, 0.01936138127747124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 301.5, 126, 367, 356.5, 367.0, 367.0, 367.0, 0.03430502311300932, 0.060703810430442276, 0.01899506650886356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=785f05d7-02cd-49bb-bfec-5dd72c9d05c5", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64d44c79-d482-4051-9940-dcb02240ceba", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 125.00000000000001, 120, 128, 126.0, 128.0, 128.0, 128.0, 0.07536362951239732, 0.05600754107317808, 0.03782900934509006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 161.30769230769232, 119, 371, 124.0, 370.2, 371.0, 371.0, 0.07536406641313421, 0.02887295212642612, 0.04249419189430479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 255.69230769230768, 118, 1373, 125.0, 972.1999999999996, 1373.0, 1373.0, 0.07525630561006813, 5.227627937528583, 0.043744988943112025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 246.69230769230768, 120, 984, 127.0, 740.7999999999997, 984.0, 984.0, 0.07526414821247647, 1.721045466058764, 0.04382304783615574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5759baf-a662-4776-908d-30842201af10", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 125.5, 120, 128, 127.0, 128.0, 128.0, 128.0, 0.03437105269941655, 0.025543331156499996, 0.019300151662270035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 248.72222222222223, 121, 1373, 126.5, 479.30000000000143, 1373.0, 1373.0, 0.08422549973796511, 4.231787588261305, 0.04911326341057124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 919.6470588235293, 123, 1500, 1285.0, 1496.8, 1500.0, 1500.0, 0.0946964421989628, 50.13287747324826, 0.050884106176993224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 198.22222222222223, 117, 732, 126.5, 408.9000000000005, 732.0, 732.0, 0.08422510563231998, 1.3972722032585758, 0.049195284680857036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 567.1176470588235, 118, 1254, 714.0, 1030.7999999999997, 1254.0, 1254.0, 0.09456632993636242, 16.36675465043834, 0.05090654169540741], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 439.69230769230774, 131, 1133, 432.0, 918.5999999999998, 1133.0, 1133.0, 0.07177958146982497, 0.014229741248412565, 0.048701410744851195], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 441.38461538461536, 248, 1496, 256.0, 1098.7999999999997, 1496.0, 1496.0, 0.07520145312346344, 7.028127151195414, 0.1676497539321683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 799.578947368421, 289, 1382, 912.0, 1189.0, 1382.0, 1382.0, 0.08594523931225714, 0.05279253469473608, 0.03886000566560065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 169.52941176470588, 119, 378, 127.0, 372.4, 378.0, 378.0, 0.0946974972008534, 0.07037577672836859, 0.04753370464964711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3ba46e1-e61e-4c71-8ce4-f489aa52c17c", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 293.0588235294117, 119, 510, 368.0, 411.5999999999999, 510.0, 510.0, 0.0945658038927735, 0.10885280206820976, 0.04926026595241671], "isController": false}, {"data": ["login", 19, 0, 0.0, 2973.1052631578946, 2149, 4266, 2795.0, 3862.0, 4266.0, 4266.0, 0.08802898470148908, 22.293041757591343, 0.1635476824632363], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 147.0, 124, 400, 131.0, 178.60000000000036, 400.0, 400.0, 0.0854664330584163, 0.06919108691936242, 0.03038064612623392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c66e41cb-6563-4df7-8f82-dea6ea5d56cb", 2, 0, 0.0, 234.5, 213, 256, 234.5, 256.0, 256.0, 256.0, 0.08477809334068077, 0.04988164183375016, 0.05269653946420245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1105.4117647058824, 243, 1628, 1413.0, 1625.6, 1628.0, 1628.0, 0.09449799330731859, 66.56174718625277, 0.19830573262348664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45b11d63-bad1-425b-8aa4-cc95d6c0d44c", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 390.6666666666667, 245, 1486, 256.0, 606.7000000000014, 1486.0, 1486.0, 0.0954993288519389, 6.487027137394354, 0.21342276226503185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 859.4285714285714, 123, 1501, 1218.0, 1501.0, 1501.0, 1501.0, 0.059447983014861996, 40.647077361995755, 0.09333532377919321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1110354-2bc6-41ad-a781-9ff317cd75fe", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1365.4545454545455, 580, 4097, 1140.5, 2645.1999999999994, 3923.1499999999974, 4097.0, 0.09129615643181423, 0.028724571945521096, 0.041190258077634934], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 431.94444444444446, 251, 1499, 370.5, 608.0000000000014, 1499.0, 1499.0, 0.0841742969108033, 5.7177464480200335, 0.18811347864311032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 160.27777777777777, 125, 382, 130.5, 375.7, 382.0, 382.0, 0.0893317981498392, 0.06935427688390836, 0.03175466262357565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ac4f750-3242-46be-b365-4c46739e7e64", 3, 0, 0.0, 451.66666666666663, 226, 786, 343.0, 786.0, 786.0, 786.0, 0.05688821465819664, 0.0365736406087039, 0.03648104911349199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bb46e33-075a-4b3d-bdae-6bcefb28f034", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.49128605769230765, 0.91796875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 403.58823529411757, 246, 749, 482.0, 640.9999999999999, 749.0, 749.0, 0.09024168847507472, 0.1398569918065855, 0.20295567242001666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 178.55555555555554, 121, 373, 126.0, 373.0, 373.0, 373.0, 0.060213154567167776, 0.044748252564076836, 0.030224181101097886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 180.77777777777777, 118, 384, 126.0, 384.0, 384.0, 384.0, 0.06030676038783948, 0.01613676986940236, 0.034393699283689703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 180.22222222222223, 117, 379, 126.0, 379.0, 379.0, 379.0, 0.06030716449114155, 0.016254665429252996, 0.03545401662467501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 178.88888888888889, 118, 372, 126.0, 372.0, 372.0, 372.0, 0.060207112466886085, 0.01622769828209039, 0.035453992985871395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 0.09498480243161095, 0.028013096029635257, 0.058716191346884494], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1366.6428571428576, 962, 2280, 1243.0, 1878.3000000000002, 2148.7, 2280.0, 0.25212505402679725, 301.62921746686357, 0.49784849535369546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1365.4545454545455, 580, 4097, 1140.5, 2645.1999999999994, 3923.1499999999974, 4097.0, 0.08639308855291578, 0.027181916355782446, 0.03897813174946004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 182.25, 118, 360, 125.5, 360.0, 360.0, 360.0, 0.05425788774043026, 0.014624196305037846, 0.031950689753397904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 123.75, 121, 125, 124.5, 125.0, 125.0, 125.0, 0.05425273637239078, 0.014622807850370954, 0.03189467509392505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 321.61111111111114, 119, 1415, 124.5, 1398.8, 1415.0, 1415.0, 0.08524220625772508, 8.542765615306658, 0.04929914923542476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46a5a0e2-75b5-4730-a9f6-afa10e48c98f", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 239.1111111111111, 119, 755, 126.0, 715.4000000000001, 755.0, 755.0, 0.08552734736932134, 2.814699804950133, 0.04954758112031322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 139.44444444444446, 121, 360, 126.0, 161.1000000000003, 360.0, 360.0, 0.08576043299489726, 0.06373407178624689, 0.043047717343141785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 185.75, 122, 370, 125.5, 370.0, 370.0, 370.0, 0.05425347222222222, 0.014517042371961806, 0.030941433376736112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 204.94444444444446, 118, 379, 127.0, 379.0, 379.0, 379.0, 0.08566248030952708, 0.03721707586364437, 0.04805501553822212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 127.0, 126, 130, 126.0, 130.0, 130.0, 130.0, 0.05425273637239078, 0.04031868396424745, 0.027232330561922716], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 533.0833333333334, 127, 1299, 449.5, 1145.1000000000006, 1299.0, 1299.0, 0.07093162782174882, 0.013328542369825686, 0.04827483752224002], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 131.75, 125, 138, 132.0, 138.0, 138.0, 138.0, 0.04901720503896868, 0.03858190162246949, 0.017424084603695898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1487.0, 1043, 2112, 1409.0, 2025.0, 2112.0, 2112.0, 0.08692787731273904, 0.044991967749757514, 0.039983427943652436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 314.0, 252, 496, 254.0, 496.0, 496.0, 496.0, 0.0541601787285898, 0.08393769886940626, 0.12180751133978741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5759baf-a662-4776-908d-30842201af10", 3, 0, 0.0, 778.3333333333334, 537, 1244, 554.0, 1244.0, 1244.0, 1244.0, 0.06534524068830319, 0.029567019712480942, 0.04190433729035069], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1297.7931034482758, 628, 3588, 1012.0, 2353.8, 2499.35, 3588.0, 0.2677487408884642, 83.8560772256037, 0.9733571970169097], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/42470778-f073-447a-95bd-07ba76382341", 3, 0, 0.0, 837.3333333333334, 221, 1299, 992.0, 1299.0, 1299.0, 1299.0, 0.03187894501944616, 0.02657616477695365, 0.02044320367457973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c333906f-73be-4be3-ada2-bcec9a1a1d5a", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 218.8928571428572, 121, 511, 128.5, 492.8, 499.0, 511.0, 0.2532607319235153, 0.18821427440800303, 0.12242584209193363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6fe83ad-6c06-404a-9959-f0742f095f08", 3, 0, 0.0, 345.0, 288, 414, 333.0, 414.0, 414.0, 414.0, 0.014969387602353189, 0.02063650927603052, 0.009599509627811127], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 800.9642857142858, 587, 1248, 741.0, 1091.5, 1124.9, 1248.0, 0.25300214148241185, 74.39103005755798, 0.12724228795258016], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 161.5892857142857, 118, 382, 128.0, 368.8, 377.75, 382.0, 0.25368867868969797, 0.44891004471262963, 0.12337593944088827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eff3c748-3e86-4d6d-bc54-dd1a08af3405", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1145.7857142857142, 833, 1780, 1098.5, 1504.2, 1647.2499999999998, 1780.0, 0.2527178450388328, 227.39596119652873, 0.12685251206050788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 130.88235294117644, 123, 154, 128.0, 149.2, 154.0, 154.0, 0.08884057819538656, 0.06637015851510812, 0.03158004928039131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, 5.813953488372093, 203.32558139534882, 119, 1713, 132.0, 359.80000000000007, 469.35, 1077.170000000009, 0.7285264705010314, 1.5579467095593686, 0.349645386034317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 159.0, 124, 384, 132.0, 384.0, 384.0, 384.0, 0.05796504063993405, 0.04488894260494893, 0.020604760539976556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eff3c748-3e86-4d6d-bc54-dd1a08af3405", 3, 0, 0.0, 331.3333333333333, 217, 440, 337.0, 440.0, 440.0, 440.0, 0.029239766081871347, 0.02951579251949318, 0.018750761452241718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c333906f-73be-4be3-ada2-bcec9a1a1d5a", 3, 0, 0.0, 339.3333333333333, 224, 451, 343.0, 451.0, 451.0, 451.0, 0.08243116997307248, 0.03729795776776392, 0.052861134390284115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 146.38888888888889, 125, 389, 129.5, 172.10000000000034, 389.0, 389.0, 0.09322367467009178, 0.07565319692465455, 0.03313810310538418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/785f05d7-02cd-49bb-bfec-5dd72c9d05c5", 3, 0, 0.0, 380.0, 220, 472, 448.0, 472.0, 472.0, 472.0, 0.020694507677662347, 0.02446020747968489, 0.013270891967771753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42470778-f073-447a-95bd-07ba76382341", 1, 0, 0.0, 1133.0, 1133, 1133, 1133.0, 1133.0, 1133.0, 1133.0, 0.88261253309797, 0.15945636584289496, 0.6085199691085613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 416.22222222222223, 248, 748, 267.0, 748.0, 748.0, 748.0, 0.06006366748753679, 0.09308695342062585, 0.13508459592167696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 498.2222222222222, 247, 1542, 262.0, 1525.8, 1542.0, 1542.0, 0.08518572855094343, 11.440879625466748, 0.18916297035536647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 136.0, 121, 156, 132.0, 155.2, 156.0, 156.0, 0.07122741269162913, 0.059054759155462044, 0.025319119355227543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3ba46e1-e61e-4c71-8ce4-f489aa52c17c", 3, 0, 0.0, 569.6666666666666, 322, 939, 448.0, 939.0, 939.0, 939.0, 0.019328776037472056, 0.022845958916686532, 0.012395080987571597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1a4b76e-3f26-42e2-9cc3-696497081354", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 130.70588235294122, 126, 135, 131.0, 135.0, 135.0, 135.0, 0.0964966055899916, 0.07491679828519855, 0.034301527768317325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1110354-2bc6-41ad-a781-9ff317cd75fe", 3, 0, 0.0, 366.6666666666667, 248, 443, 409.0, 443.0, 443.0, 443.0, 0.022376871265859608, 0.02644870428591674, 0.014349751430255022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 139.52941176470588, 120, 373, 126.0, 177.79999999999984, 373.0, 373.0, 0.09030112770173007, 0.067108552911149, 0.045326933240907474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 181.76470588235293, 120, 377, 124.0, 375.4, 377.0, 377.0, 0.09030304639983001, 0.024163119837454516, 0.051500956149903056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 195.29411764705884, 118, 376, 126.0, 376.0, 376.0, 376.0, 0.0903054448871182, 0.024340139442231075, 0.05308972443559097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 217.5882352941177, 119, 486, 125.0, 399.5999999999999, 486.0, 486.0, 0.09030448547691393, 0.024339880851199456, 0.0531773483814249], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.4676539360872954], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1558846453624318], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.0779423226812159], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.0911925175370225], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 23, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
