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

    var data = {"OkPercent": 98.99425287356321, "KoPercent": 1.0057471264367817};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.805607476635514, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11206896551724138, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71102309-f002-459e-af27-79ea51fa61db"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53e341d5-f807-4e16-8152-1d5830b267e4"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2964b4ef-5fc5-45a4-8366-5ccba9c3ed32"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/976a6228-f5d6-4258-943a-f9787c434de0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96b01f76-eb3d-47bc-b6a8-76e78b3bdc39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce934f6c-7c51-44c1-9fca-1a7f3b699ee7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03b1ad98-8e6e-43c7-962f-7971dba7a70e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e72a748-29d0-4cb0-bf21-12a6f1ee0a86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ee0c319-708e-4718-a427-bbb95c23417c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3af310dc-5ffa-49c6-bd84-30a28b6fe813"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96b01f76-eb3d-47bc-b6a8-76e78b3bdc39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d619588-b505-41e8-af6a-4bc1463fc082"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f268118-1229-4dc3-87f7-12c02bbb7cd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eab51c48-e0dc-459c-a7ca-8083a5574d44"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=066950a8-4e75-4b8b-925c-aefdcef00dc1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03b1ad98-8e6e-43c7-962f-7971dba7a70e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f87dbb3-1201-43a7-b456-60c1d8df6e6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.39655172413793105, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92652093-5580-4cdd-96ce-f69317c7d125"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71102309-f002-459e-af27-79ea51fa61db"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3188405797101449, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5431034482758621, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9362244897959183, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce934f6c-7c51-44c1-9fca-1a7f3b699ee7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8d619588-b505-41e8-af6a-4bc1463fc082"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ee0c319-708e-4718-a427-bbb95c23417c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3af310dc-5ffa-49c6-bd84-30a28b6fe813"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/279ea7ce-e564-41db-a200-784a48776195"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=976a6228-f5d6-4258-943a-f9787c434de0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92652093-5580-4cdd-96ce-f69317c7d125"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/066950a8-4e75-4b8b-925c-aefdcef00dc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53e341d5-f807-4e16-8152-1d5830b267e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1392, 14, 1.0057471264367817, 341.27945402298843, 97, 2743, 113.5, 995.4000000000001, 1187.0, 1537.0, 5.361888987327145, 713.1323638101383, 3.9281277685759406], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1701.0344827586212, 1231, 2128, 1672.0, 2051.3, 2094.4, 2128.0, 0.26349264037797565, 317.0712947412207, 1.2955912542022532], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/71102309-f002-459e-af27-79ea51fa61db", 3, 0, 0.0, 269.6666666666667, 191, 423, 195.0, 423.0, 423.0, 423.0, 0.02236352657905134, 0.026432931317882623, 0.014341193802321335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53e341d5-f807-4e16-8152-1d5830b267e4", 1, 0, 0.0, 1558.0, 1558, 1558, 1558.0, 1558.0, 1558.0, 1558.0, 0.6418485237483953, 0.11595896181001283, 0.4425244704749679], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 515.3636363636364, 424, 893, 469.0, 834.6000000000001, 893.0, 893.0, 0.06942735058918574, 0.012543027206054066, 0.047188902353587185], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 515.3636363636364, 424, 893, 469.0, 834.6000000000001, 893.0, 893.0, 0.06995275009697996, 0.012637948015567666, 0.04754600983154106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 146.05555555555554, 98, 309, 102.0, 306.3, 309.0, 309.0, 0.07877427232265942, 0.03422441258462764, 0.044190862403228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 103.5, 100, 122, 102.0, 106.70000000000002, 122.0, 122.0, 0.07877254864204879, 0.05854092726230383, 0.0395401269550909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 190.99999999999997, 99, 808, 102.0, 805.3, 808.0, 808.0, 0.07877392758050257, 2.592445170064157, 0.04563519958249818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 237.8888888888889, 99, 1066, 103.0, 1003.9000000000001, 1066.0, 1066.0, 0.07877289337213628, 7.89442688617317, 0.045557673792696006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2964b4ef-5fc5-45a4-8366-5ccba9c3ed32", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 244.54545454545453, 194, 381, 205.0, 372.40000000000003, 381.0, 381.0, 0.06942559784906875, 0.1713081557721073, 0.04488256423445655], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/976a6228-f5d6-4258-943a-f9787c434de0", 3, 0, 0.0, 364.3333333333333, 305, 407, 381.0, 407.0, 407.0, 407.0, 0.027594326606449712, 0.03261555986589157, 0.017695580538641256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96b01f76-eb3d-47bc-b6a8-76e78b3bdc39", 3, 0, 0.0, 351.0, 230, 496, 327.0, 496.0, 496.0, 496.0, 0.02877421830040284, 0.028858517768079798, 0.018452216813734892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce934f6c-7c51-44c1-9fca-1a7f3b699ee7", 3, 0, 0.0, 338.3333333333333, 205, 424, 386.0, 424.0, 424.0, 424.0, 0.04805612955932529, 0.030895460898329247, 0.030817244541624617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 103.22222222222223, 100, 108, 103.0, 106.2, 108.0, 108.0, 0.11292629677030791, 0.08392276547090266, 0.05668370755853347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 101.94444444444444, 99, 104, 102.0, 104.0, 104.0, 104.0, 0.11292629677030791, 0.03021660675299255, 0.06440327862681623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 659.25, 606, 812, 609.5, 812.0, 812.0, 812.0, 0.034319445397762376, 10.09105645977761, 0.01957280870341135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1024.0, 904, 1201, 995.5, 1201.0, 1201.0, 1201.0, 0.03414629982158558, 30.724900602255364, 0.019440715621078512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 328.5, 298, 409, 303.5, 409.0, 409.0, 409.0, 0.03437873331557099, 0.060834242937318976, 0.019035880654227295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03b1ad98-8e6e-43c7-962f-7971dba7a70e", 3, 0, 0.0, 510.6666666666667, 199, 937, 396.0, 937.0, 937.0, 937.0, 0.044334756971640535, 0.028502976894202493, 0.028430817459027296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 126.23529411764706, 99, 304, 103.0, 299.2, 304.0, 304.0, 0.08716384238726382, 0.06477703521162868, 0.04375216307329454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 182.88235294117644, 99, 303, 104.0, 301.4, 303.0, 303.0, 0.08716607701379275, 0.04642715223298979, 0.048420034738245396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 295.7647058823529, 99, 994, 105.0, 923.5999999999999, 994.0, 994.0, 0.08707455118190897, 13.84576900113965, 0.04986978833201014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 246.8235294117647, 98, 786, 104.0, 778.0, 786.0, 786.0, 0.08707455118190897, 4.537470468281814, 0.04995482207339872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 154.5, 103, 306, 104.5, 306.0, 306.0, 306.0, 0.03446879281670358, 0.02561596809913225, 0.0193550350289107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 705.421052631579, 100, 1342, 1082.0, 1300.0, 1342.0, 1342.0, 0.08488623011316675, 40.211247690759464, 0.04606439234862328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 135.8888888888889, 99, 312, 102.5, 308.4, 312.0, 312.0, 0.11292558831094689, 0.030436974974434903, 0.06638789469061526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 464.15789473684214, 99, 901, 606.0, 816.0, 901.0, 901.0, 0.08496290698350378, 13.159224120969292, 0.04618897343567637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 113.33333333333331, 99, 308, 102.5, 125.3000000000003, 308.0, 308.0, 0.1129284222017278, 0.030437738796559446, 0.06649984237074401], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 608.2727272727271, 190, 1558, 526.0, 1393.0000000000005, 1558.0, 1558.0, 0.07011281789789024, 0.012666866514755562, 0.04833950140225636], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 447.11764705882354, 202, 1095, 402.0, 1027.8, 1095.0, 1095.0, 0.08702774649329374, 18.484387398254327, 0.1917979948423262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 459.33333333333326, 128, 1094, 493.0, 850.8000000000002, 1074.0999999999997, 1094.0, 0.08975087720797843, 0.055130177503728936, 0.04058071889384181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 123.84210526315788, 99, 307, 103.0, 300.0, 307.0, 307.0, 0.08496176720475786, 0.06314053207306712, 0.042646824553950725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 175.21052631578948, 97, 309, 102.0, 309.0, 309.0, 309.0, 0.0849636668529905, 0.08989833705980994, 0.0447002515371716], "isController": false}, {"data": ["login", 21, 0, 0.0, 2165.1428571428573, 1502, 3487, 1960.0, 3337.0, 3476.8999999999996, 3487.0, 0.08473755568467944, 19.42744807050568, 0.15461530284597133], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6e72a748-29d0-4cb0-bf21-12a6f1ee0a86", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ee0c319-708e-4718-a427-bbb95c23417c", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3af310dc-5ffa-49c6-bd84-30a28b6fe813", 3, 0, 0.0, 394.0, 256, 662, 264.0, 662.0, 662.0, 662.0, 0.02204229181055385, 0.02605324269665398, 0.014135193641533554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 106.94444444444443, 102, 115, 106.0, 113.2, 115.0, 115.0, 0.11216001495466865, 0.09080141835685578, 0.03986938031591737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96b01f76-eb3d-47bc-b6a8-76e78b3bdc39", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d619588-b505-41e8-af6a-4bc1463fc082", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 0.24647211800818555, 0.9405908935879945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 841.4736842105264, 202, 1446, 1187.0, 1402.0, 1446.0, 1446.0, 0.08484680685740825, 53.486644686971104, 0.1793967461807773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f268118-1229-4dc3-87f7-12c02bbb7cd0", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eab51c48-e0dc-459c-a7ca-8083a5574d44", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=066950a8-4e75-4b8b-925c-aefdcef00dc1", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 376.22222222222234, 202, 1169, 208.0, 1106.9, 1169.0, 1169.0, 0.07873671317965093, 10.5747438322908, 0.17484232153011678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1179.0, 1009, 1304, 1201.5, 1304.0, 1304.0, 1304.0, 0.034115720524017464, 40.81426229018832, 0.07692695184566048], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1080.3809523809523, 466, 2743, 1031.0, 1436.0, 2612.699999999998, 2743.0, 0.08794706424323645, 0.027925156001340146, 0.03967924187536644], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03b1ad98-8e6e-43c7-962f-7971dba7a70e", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 252.2222222222222, 204, 418, 208.0, 413.5, 418.0, 418.0, 0.11285266457680251, 0.17489958855799373, 0.25380828761755486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 119.99999999999999, 102, 306, 105.0, 193.20000000000007, 306.0, 306.0, 0.09341138373396438, 0.07252153327002117, 0.03320482781168265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f87dbb3-1201-43a7-b456-60c1d8df6e6a", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 321.2, 203, 413, 401.0, 410.6, 413.0, 413.0, 0.10732838191731423, 0.1663380293972438, 0.24138404644099085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 141.27272727272728, 99, 312, 103.0, 310.4, 312.0, 312.0, 0.053148569578725116, 0.03949810688418926, 0.026678090589321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 164.9090909090909, 98, 400, 102.0, 380.4000000000001, 400.0, 400.0, 0.05309931019168851, 0.014208213859885403, 0.030283200343697355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 138.63636363636363, 98, 308, 102.0, 305.8, 308.0, 308.0, 0.053151137675942345, 0.014325892576718836, 0.031247055547770793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 173.45454545454544, 99, 304, 104.0, 303.8, 304.0, 304.0, 0.05310059183023259, 0.014312268891742376, 0.03126919616565454], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1178.3103448275865, 792, 1702, 1104.0, 1620.1, 1663.5, 1702.0, 0.2454932933771835, 293.6953261568872, 0.484753358602212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1080.3809523809523, 466, 2743, 1031.0, 1436.0, 2612.699999999998, 2743.0, 0.0848035989032068, 0.026927035589243673, 0.03826099872390775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 117.57142857142856, 100, 314, 102.5, 210.5, 314.0, 314.0, 0.06234636075385657, 0.016804292546937903, 0.036713726107983895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 131.35714285714286, 100, 301, 102.5, 300.0, 301.0, 301.0, 0.06234747136469707, 0.01680459189126601, 0.03665349390776137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 155.39999999999998, 98, 307, 102.0, 306.4, 307.0, 307.0, 0.09086063190540802, 0.02448977969325451, 0.05341611367876527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 131.26666666666668, 99, 307, 103.0, 304.0, 307.0, 307.0, 0.09085677943002513, 0.024488741330748964, 0.05350257616826676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 117.0, 99, 313, 101.5, 211.0, 313.0, 313.0, 0.06234747136469707, 0.016682819486256835, 0.03555754226267881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 116.53333333333333, 99, 304, 104.0, 187.60000000000008, 304.0, 304.0, 0.09097028910357877, 0.06760584961701507, 0.04566282089769481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 103.85714285714286, 100, 116, 103.0, 112.0, 116.0, 116.0, 0.06234552782169179, 0.046332955734675246, 0.03129453251987264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92652093-5580-4cdd-96ce-f69317c7d125", 3, 0, 0.0, 338.0, 238, 438, 338.0, 438.0, 438.0, 438.0, 0.031124852156952258, 0.02594750858527172, 0.019959621988670555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 144.13333333333335, 99, 311, 102.0, 306.2, 311.0, 311.0, 0.09097028910357877, 0.02434165938904354, 0.051881493004384764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 108.92857142857143, 102, 128, 106.0, 122.5, 128.0, 128.0, 0.0611839977624138, 0.04815849823877492, 0.021748999204608026], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 489.6363636363636, 396, 662, 462.0, 645.4000000000001, 662.0, 662.0, 0.07171356299058597, 0.01295606362622891, 0.04881284512152189], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71102309-f002-459e-af27-79ea51fa61db", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1216.4761904761904, 780, 1886, 1143.0, 1519.8000000000002, 1851.0999999999995, 1886.0, 0.08717744345920096, 0.04512113772790675, 0.04009821862234732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 252.07142857142858, 204, 417, 208.0, 417.0, 417.0, 417.0, 0.062315557078824725, 0.09657694246493637, 0.14014914839114584], "isController": false}, {"data": ["addBook", 69, 10, 14.492753623188406, 1016.3333333333336, 526, 2383, 831.0, 1813.0, 1967.0, 2383.0, 0.3072757554975641, 81.0310729824452, 1.121376463178122], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 185.39655172413796, 99, 414, 104.0, 405.3, 411.05, 414.0, 0.2467203212468735, 0.18335367623913154, 0.11926421779023667], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 653.9827586206897, 489, 1005, 601.5, 876.9, 910.55, 1005.0, 0.24653679561674582, 72.49000370336523, 0.12399067357678134], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 159.15517241379303, 99, 316, 104.5, 307.0, 308.15, 316.0, 0.2468662878546043, 0.4368376109302177, 0.12005801889803996], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 991.5517241379312, 688, 1370, 987.5, 1225.2, 1304.25, 1370.0, 0.24594717224358945, 221.3036979137955, 0.123453951692583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 106.06666666666666, 101, 113, 106.0, 111.2, 113.0, 113.0, 0.10051396138923697, 0.0750909965456702, 0.03572957221258033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 196, 10, 5.1020408163265305, 172.84693877551015, 99, 1104, 110.0, 307.50000000000006, 365.89999999999986, 1091.39, 0.7928706366832118, 1.5461498874406865, 0.3864643885794266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 142.45454545454547, 102, 307, 106.0, 305.4, 307.0, 307.0, 0.05551546105590407, 0.04299195372786321, 0.0197340115472159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce934f6c-7c51-44c1-9fca-1a7f3b699ee7", 1, 0, 0.0, 706.0, 706, 706, 706.0, 706.0, 706.0, 706.0, 1.41643059490085, 0.2558981055240793, 0.9765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d619588-b505-41e8-af6a-4bc1463fc082", 3, 0, 0.0, 569.6666666666666, 203, 927, 579.0, 927.0, 927.0, 927.0, 0.02156644261529061, 0.025490805057330795, 0.013830042953164876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 129.94444444444446, 101, 327, 106.5, 309.0, 327.0, 327.0, 0.07824658105911093, 0.0634989344337121, 0.027814214360855842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ee0c319-708e-4718-a427-bbb95c23417c", 3, 0, 0.0, 323.3333333333333, 194, 554, 222.0, 554.0, 554.0, 554.0, 0.08282945415389713, 0.038934157486402166, 0.053116544493221785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3af310dc-5ffa-49c6-bd84-30a28b6fe813", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/279ea7ce-e564-41db-a200-784a48776195", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=976a6228-f5d6-4258-943a-f9787c434de0", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 344.7272727272727, 203, 705, 216.0, 687.2, 705.0, 705.0, 0.05307112978786022, 0.08224988571614665, 0.11935821474750204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 303.40000000000003, 202, 606, 220.0, 492.00000000000006, 606.0, 606.0, 0.09080068039976513, 0.14072332011174538, 0.20421285836001865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92652093-5580-4cdd-96ce-f69317c7d125", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 108.0, 102, 123, 105.0, 121.4, 123.0, 123.0, 0.09179662188431466, 0.07610872263650698, 0.032630830435439975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/066950a8-4e75-4b8b-925c-aefdcef00dc1", 3, 0, 0.0, 282.6666666666667, 189, 462, 197.0, 462.0, 462.0, 462.0, 0.022169344230797652, 0.026203414356128347, 0.014216669314671672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 125.94736842105263, 101, 305, 105.0, 299.0, 305.0, 305.0, 0.0855952246874648, 0.06645332385403761, 0.030426427525622256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53e341d5-f807-4e16-8152-1d5830b267e4", 3, 0, 0.0, 361.3333333333333, 247, 545, 292.0, 545.0, 545.0, 545.0, 0.017570163519655155, 0.024221888836503773, 0.011267324913320527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 102.73333333333333, 100, 107, 102.0, 105.8, 107.0, 107.0, 0.10740754000930866, 0.0798214237764491, 0.053913550356235004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 147.06666666666663, 100, 303, 102.0, 303.0, 303.0, 303.0, 0.10740523278294119, 0.028739290803247938, 0.06125454682152115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 216.40000000000003, 100, 309, 292.0, 307.2, 309.0, 309.0, 0.10740600184738323, 0.02894927393542751, 0.06314298155480928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 149.13333333333333, 99, 305, 103.0, 300.2, 305.0, 305.0, 0.10740677092283897, 0.02894948122529644, 0.06324832311178896], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 28.571428571428573, 0.28735632183908044], "isController": false}, {"data": ["401/Unauthorized", 10, 71.42857142857143, 0.7183908045977011], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1392, 14, "401/Unauthorized", 10, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 196, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
