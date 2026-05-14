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

    var data = {"OkPercent": 98.22353811991118, "KoPercent": 1.776461880088823};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.735969387755102, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f312176-cce1-41ba-a47d-bb395c40f07c"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bccf405c-9425-444e-b13b-383c7d3c6648"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b86f00bd-b1e9-462b-b2cb-81600291fbc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/169b047e-e0e0-4db7-96b1-4adae77b9700"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a2503d7-5399-44cf-9e2f-89c3a5f90a8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1da2a8f-fa5c-44c8-814b-f7035b8757bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27d194ee-cfd0-4f42-a114-42be592395f9"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f4185f3-8d55-4896-a31c-0bbd020309a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95e31e02-a490-4496-a8a8-f539060fabec"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ad2e2b1-4744-4624-abe9-308d6a7ecf87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=740fff42-1b5f-41de-9234-89de3573214f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95c4b6d3-8275-4cec-ab5c-f0f6f6360b0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b86f00bd-b1e9-462b-b2cb-81600291fbc2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eba0bc2e-3479-479c-8758-9fff1ae3dd58"], "isController": false}, {"data": [0.5238095238095238, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d79c6eee-4691-4858-8ec2-8d219ad92de1"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21551724137931033, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7142a18-db6a-466f-aee3-3ac82c5ebcb7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e927b26e-7515-4af7-8fd1-c7fc7483bb44"], "isController": false}, {"data": [0.29838709677419356, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eba0bc2e-3479-479c-8758-9fff1ae3dd58"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/27d194ee-cfd0-4f42-a114-42be592395f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f312176-cce1-41ba-a47d-bb395c40f07c"], "isController": false}, {"data": [0.9051724137931034, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3103448275862069, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9340659340659341, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/740fff42-1b5f-41de-9234-89de3573214f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a2503d7-5399-44cf-9e2f-89c3a5f90a8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7142a18-db6a-466f-aee3-3ac82c5ebcb7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e927b26e-7515-4af7-8fd1-c7fc7483bb44"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95c4b6d3-8275-4cec-ab5c-f0f6f6360b0b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d79c6eee-4691-4858-8ec2-8d219ad92de1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ad2e2b1-4744-4624-abe9-308d6a7ecf87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 24, 1.776461880088823, 477.37009622501836, 137, 2652, 161.0, 1323.8, 1630.0, 2166.0800000000004, 5.330292712373303, 739.8179343229325, 3.89999662787968], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2434.3965517241386, 1779, 3277, 2403.0, 2916.7, 3072.1, 3277.0, 0.2522002295891745, 303.4827292440298, 1.2400665585756774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f312176-cce1-41ba-a47d-bb395c40f07c", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 484.23076923076917, 151, 689, 518.0, 661.0, 689.0, 689.0, 0.08497787306920467, 0.016846199446336474, 0.057132809793373034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 484.23076923076917, 151, 689, 518.0, 661.0, 689.0, 689.0, 0.0839066957543212, 0.016633846912233595, 0.05641262973266036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bccf405c-9425-444e-b13b-383c7d3c6648", 2, 0, 0.0, 287.5, 233, 342, 287.5, 342.0, 342.0, 342.0, 0.043785712721938826, 0.03869733399741664, 0.027216412253431705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b86f00bd-b1e9-462b-b2cb-81600291fbc2", 3, 0, 0.0, 363.0, 256, 554, 279.0, 554.0, 554.0, 554.0, 0.07411616473552882, 0.03353563443437014, 0.047528920745114514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 230.2142857142857, 138, 445, 150.0, 444.0, 445.0, 445.0, 0.08110957904128478, 0.030404776630012863, 0.045771239846818766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 200.21428571428572, 137, 600, 148.5, 523.0, 600.0, 600.0, 0.08110488019650554, 0.06027423225541085, 0.04071084806738656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 318.2142857142857, 145, 1098, 154.0, 771.5, 1098.0, 1098.0, 0.08097446990641664, 1.720922122080581, 0.047186155245410484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 324.42857142857144, 137, 1468, 149.5, 956.0, 1468.0, 1468.0, 0.08096604052928658, 5.224077357629892, 0.047102174805681504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/169b047e-e0e0-4db7-96b1-4adae77b9700", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 266.3571428571428, 148, 409, 256.0, 407.0, 409.0, 409.0, 0.07882350291646961, 0.16714805305947797, 0.05094716643582641], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a2503d7-5399-44cf-9e2f-89c3a5f90a8d", 3, 0, 0.0, 330.0, 244, 478, 268.0, 478.0, 478.0, 478.0, 0.02798899099687456, 0.02807098999393572, 0.01794866935671969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 180.44444444444443, 143, 447, 150.0, 430.8, 447.0, 447.0, 0.10194892358928177, 0.07576477622211272, 0.0511735807860262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 242.05555555555551, 139, 446, 150.0, 444.2, 446.0, 446.0, 0.10177771746505632, 0.035726010850635544, 0.05757023015899941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1038.4, 857, 1174, 1136.0, 1174.0, 1174.0, 1174.0, 0.07362035455562754, 21.646828665189354, 0.04198660845750633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1275.2, 1040, 1615, 1274.0, 1615.0, 1615.0, 1615.0, 0.07283851700779373, 65.54022564006847, 0.04146958536674194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 321.6, 149, 448, 413.0, 448.0, 448.0, 448.0, 0.07410042089039065, 0.1311230104036991, 0.0410302135203628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 194.57894736842104, 139, 446, 150.0, 444.0, 446.0, 446.0, 0.1026544273773955, 0.07628908128339647, 0.05152771061716922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 216.78947368421055, 139, 575, 148.0, 444.0, 575.0, 575.0, 0.10265664593722816, 0.02746867283867238, 0.05854636838607544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1da2a8f-fa5c-44c8-814b-f7035b8757bd", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 208.5263157894737, 144, 445, 149.0, 432.0, 445.0, 445.0, 0.10265664593722816, 0.027669174100268527, 0.060350879740440774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 222.89473684210526, 137, 448, 149.0, 447.0, 448.0, 448.0, 0.10265941927187457, 0.02766992160062244, 0.06045276349701207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 147.2, 142, 152, 148.0, 152.0, 152.0, 152.0, 0.07442912858376254, 0.055313053566643844, 0.04179370013248385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 845.2380952380952, 138, 2047, 151.0, 1828.6000000000001, 2029.9999999999998, 2047.0, 0.09616001025706776, 41.21593152434222, 0.05259644906266885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 301.6111111111111, 143, 2058, 148.0, 604.5000000000023, 2058.0, 2058.0, 0.10194834617127323, 5.1222461999461935, 0.05944774439284096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 640.3809523809524, 140, 1451, 446.0, 1290.6, 1435.2999999999997, 1451.0, 0.09615868931127483, 13.477312845427196, 0.052689631517613064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 236.11111111111114, 141, 880, 146.5, 490.30000000000064, 880.0, 880.0, 0.10177829295185321, 1.6884749335613922, 0.059447976449633885], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 451.61538461538464, 157, 701, 507.0, 693.0, 701.0, 701.0, 0.08408742504899709, 0.016669675082955478, 0.057052105096344785], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27d194ee-cfd0-4f42-a114-42be592395f9", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 474.2631578947369, 288, 1021, 305.0, 890.0, 1021.0, 1021.0, 0.1025718542831847, 0.1589663405736466, 0.23068650431071716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f4185f3-8d55-4896-a31c-0bbd020309a8", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95e31e02-a490-4496-a8a8-f539060fabec", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 633.1428571428572, 183, 1238, 557.0, 1162.8000000000002, 1232.8, 1238.0, 0.09245765659465242, 0.0567928378887074, 0.04180458496418366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 148.76190476190476, 138, 170, 150.0, 151.8, 168.2, 170.0, 0.09616001025706776, 0.07146266387268414, 0.04826781764856722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 238.6190476190476, 143, 577, 148.0, 447.0, 563.9999999999998, 577.0, 0.09615868931127483, 0.09450417317264148, 0.05099487039182376], "isController": false}, {"data": ["login", 21, 0, 0.0, 2770.714285714286, 1781, 4044, 2572.0, 3730.2000000000003, 4015.9999999999995, 4044.0, 0.0935049668947891, 26.76297475338065, 0.17799599236598734], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4ad2e2b1-4744-4624-abe9-308d6a7ecf87", 3, 0, 0.0, 346.6666666666667, 236, 540, 264.0, 540.0, 540.0, 540.0, 0.021248415222364665, 0.02511490744544469, 0.013626099605487756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 154.7777777777778, 145, 170, 154.0, 163.70000000000002, 170.0, 170.0, 0.09634788007900527, 0.07800038338427281, 0.0342486604968339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=740fff42-1b5f-41de-9234-89de3573214f", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95c4b6d3-8275-4cec-ab5c-f0f6f6360b0b", 3, 0, 0.0, 488.33333333333337, 276, 814, 375.0, 814.0, 814.0, 814.0, 0.02017240683710109, 0.02384310196143036, 0.012936081207385791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b86f00bd-b1e9-462b-b2cb-81600291fbc2", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.7169208829365079, 2.7359250992063493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eba0bc2e-3479-479c-8758-9fff1ae3dd58", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 1010.52380952381, 292, 2193, 590.0, 1980.6000000000001, 2176.1, 2193.0, 0.09609400739466266, 54.821742935088494, 0.20440979260854047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 609.6428571428571, 289, 1613, 580.5, 1329.5, 1613.0, 1613.0, 0.08089633135137321, 7.029285149094828, 0.1804593105899076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 869.0, 148, 1764, 1279.0, 1764.0, 1764.0, 1764.0, 0.08628541297157374, 57.358790026844346, 0.13350083588993816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d79c6eee-4691-4858-8ec2-8d219ad92de1", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.26529230910425844, 1.012412812041116], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1117.391304347826, 165, 2250, 1114.0, 1885.2, 2183.599999999999, 2250.0, 0.09228164357619455, 0.02907310611987787, 0.0416348821603534], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 173.92857142857144, 146, 449, 153.0, 304.5, 449.0, 449.0, 0.06413516026918444, 0.04979243399804846, 0.022798045251936655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 563.5555555555555, 289, 2506, 437.5, 1034.5000000000023, 2506.0, 2506.0, 0.10169319164081965, 6.907760523479829, 0.2272648627424394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 518.1538461538461, 292, 1441, 582.0, 1103.7999999999997, 1441.0, 1441.0, 0.06771679793307496, 6.328631248176856, 0.1509638981565404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 203.41666666666669, 144, 508, 150.0, 488.50000000000006, 508.0, 508.0, 0.08101320515243984, 0.06020610265723313, 0.040664831492533283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 194.83333333333334, 142, 444, 151.0, 434.1, 444.0, 444.0, 0.08101320515243984, 0.021677361534930193, 0.04620284356350085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 168.91666666666666, 137, 426, 146.5, 343.5000000000003, 426.0, 426.0, 0.0808630785921738, 0.021795126651796844, 0.047538645812977176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 219.25, 140, 444, 149.0, 440.40000000000003, 444.0, 444.0, 0.0810126582278481, 0.021835443037974682, 0.04770569620253164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 157.5, 157, 158, 157.5, 158.0, 158.0, 158.0, 0.034163506542311504, 0.010075565406033275, 0.021118651993440606], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1686.5517241379312, 1113, 2652, 1621.5, 2309.0, 2491.2, 2652.0, 0.26715676113882475, 319.6123650397741, 0.5275302451393591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1117.391304347826, 165, 2250, 1114.0, 1885.2, 2183.599999999999, 2250.0, 0.09267168436830145, 0.029195987517527038, 0.041810857595854754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 144.55555555555554, 139, 150, 144.0, 150.0, 150.0, 150.0, 0.05180601525399338, 0.013963340048927905, 0.03050686249820118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 143.22222222222223, 138, 149, 141.0, 149.0, 149.0, 149.0, 0.05180362970765485, 0.013962697069641346, 0.030454868246101777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 393.57142857142856, 139, 1575, 150.5, 1448.0, 1575.0, 1575.0, 0.06626027034190299, 8.53260900110276, 0.03814032860361213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 290.7857142857143, 143, 1129, 149.0, 998.0, 1129.0, 1129.0, 0.06626058394506051, 2.798566789485392, 0.03820521671943849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 191.85714285714286, 143, 450, 149.0, 447.0, 450.0, 450.0, 0.06625493954236768, 0.04923829003099785, 0.03325687394997752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 147.77777777777777, 143, 151, 148.0, 151.0, 151.0, 151.0, 0.05180392788893238, 0.013861597892155735, 0.02954442762415675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 230.49999999999997, 139, 447, 150.5, 445.0, 447.0, 447.0, 0.06626027034190299, 0.03194691605770323, 0.03699408508765287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 147.11111111111111, 141, 151, 149.0, 151.0, 151.0, 151.0, 0.05180541884681138, 0.038499925529710405, 0.026003891882090867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 217.44444444444446, 147, 434, 157.0, 434.0, 434.0, 434.0, 0.053129630394871216, 0.04181883017408809, 0.01888592330442688], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 537.3076923076922, 148, 998, 554.0, 924.4, 998.0, 998.0, 0.08304905004663524, 0.01611446035685538, 0.05651602647028761], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1410.2380952380952, 989, 2177, 1417.0, 1941.0000000000002, 2159.1, 2177.0, 0.09475465313028765, 0.04904293570219966, 0.04358343908629442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 296.1111111111111, 288, 301, 298.0, 301.0, 301.0, 301.0, 0.05176102509834595, 0.08021947932722169, 0.11641175859520578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7142a18-db6a-466f-aee3-3ac82c5ebcb7", 3, 0, 0.0, 407.6666666666667, 317, 497, 409.0, 497.0, 497.0, 497.0, 0.017036645825169942, 0.023486391624217024, 0.010925192798041921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e927b26e-7515-4af7-8fd1-c7fc7483bb44", 1, 0, 0.0, 701.0, 701, 701, 701.0, 701.0, 701.0, 701.0, 1.4265335235378032, 0.2577233416547789, 0.9835279957203995], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 1407.5967741935488, 753, 3097, 1169.5, 2483.2000000000003, 2624.8499999999995, 3097.0, 0.2802817283437158, 82.20941926021446, 1.0200474896702623], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eba0bc2e-3479-479c-8758-9fff1ae3dd58", 3, 0, 0.0, 360.0, 243, 564, 273.0, 564.0, 564.0, 564.0, 0.027311708529446574, 0.03276160349316752, 0.017514344336917235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27d194ee-cfd0-4f42-a114-42be592395f9", 3, 0, 0.0, 966.6666666666666, 234, 2048, 618.0, 2048.0, 2048.0, 2048.0, 0.09552010698251981, 0.043220360906804214, 0.06125475610532684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f312176-cce1-41ba-a47d-bb395c40f07c", 3, 0, 0.0, 643.6666666666666, 340, 1094, 497.0, 1094.0, 1094.0, 1094.0, 0.029573549417401077, 0.02966019067545987, 0.01896480870842452], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 261.44827586206907, 143, 607, 151.0, 588.4, 598.35, 607.0, 0.26875118737054765, 0.1997262242079949, 0.12991390405119246], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 938.3620689655176, 682, 1384, 880.0, 1184.7, 1247.9999999999995, 1384.0, 0.2686702674658835, 78.99797932744421, 0.13512225365715821], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 217.65517241379314, 140, 603, 151.0, 444.2, 450.05, 603.0, 0.2693765326595824, 0.4766701925577766, 0.13100538404733594], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1418.51724137931, 967, 1923, 1390.5, 1763.3, 1895.6, 1923.0, 0.2679540782148715, 241.10555059076944, 0.13450038691644914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 176.84615384615384, 146, 432, 155.0, 331.9999999999999, 432.0, 432.0, 0.06560289056428578, 0.04900997195476428, 0.023319777505273462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, 5.4945054945054945, 205.2912087912088, 139, 905, 153.0, 326.3000000000002, 384.44999999999993, 819.5099999999987, 0.7677316482607925, 1.636298929710371, 0.36951369789337807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 179.08333333333334, 151, 447, 153.0, 362.1000000000003, 447.0, 447.0, 0.0812276200984208, 0.0629038112676247, 0.02887388058186052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/740fff42-1b5f-41de-9234-89de3573214f", 3, 0, 0.0, 634.6666666666666, 256, 1094, 554.0, 1094.0, 1094.0, 1094.0, 0.017090900804411734, 0.023561186493061093, 0.010959985216370803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 155.2142857142857, 147, 170, 152.0, 169.0, 170.0, 170.0, 0.08538824203907122, 0.0692945597016291, 0.0303528516623261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a2503d7-5399-44cf-9e2f-89c3a5f90a8d", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7142a18-db6a-466f-aee3-3ac82c5ebcb7", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 448.75, 293, 953, 303.0, 927.5000000000001, 953.0, 953.0, 0.0807803380657148, 0.1251937465920795, 0.18167687359896603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e927b26e-7515-4af7-8fd1-c7fc7483bb44", 3, 0, 0.0, 365.0, 246, 573, 276.0, 573.0, 573.0, 573.0, 0.02582866982350409, 0.025904339754627637, 0.016563307145931985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 632.2142857142857, 291, 1766, 447.5, 1744.0, 1766.0, 1766.0, 0.06620981891614526, 11.403662201050844, 0.1464873769797918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95c4b6d3-8275-4cec-ab5c-f0f6f6360b0b", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d79c6eee-4691-4858-8ec2-8d219ad92de1", 3, 0, 0.0, 599.0, 394, 998, 405.0, 998.0, 998.0, 998.0, 0.03066606697469027, 0.02556503825591855, 0.01966541404301427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ad2e2b1-4744-4624-abe9-308d6a7ecf87", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 182.1052631578947, 145, 434, 152.0, 431.0, 434.0, 434.0, 0.10590740348491098, 0.08780799370965765, 0.03764677233252695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 165.52380952380952, 143, 433, 152.0, 160.8, 405.7999999999996, 433.0, 0.09472558899018012, 0.0735418391085871, 0.03367198671135309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 146.46153846153848, 138, 154, 146.0, 152.8, 154.0, 154.0, 0.06777010295842564, 0.050364305030626874, 0.0340174149615535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 232.2307692307692, 141, 442, 146.0, 437.6, 442.0, 442.0, 0.06777045625156394, 0.025963741502627407, 0.03821251837621987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 324.69230769230774, 137, 1286, 149.0, 950.7999999999997, 1286.0, 1286.0, 0.0677683365479852, 4.707481274109889, 0.03939238192670594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 332.69230769230774, 139, 1139, 150.0, 861.7999999999997, 1139.0, 1139.0, 0.06776868982270667, 1.549648792023104, 0.03945876763940801], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 25.0, 0.44411547002220575], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.14803849000740193], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.14803849000740193], "isController": false}, {"data": ["401/Unauthorized", 14, 58.333333333333336, 1.0362694300518134], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 24, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
